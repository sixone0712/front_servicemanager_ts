import { Modal } from 'antd';
import axios from 'axios';
import { CancelInfo, LogFileList } from '../components/Dashboard/LogTable';
import React from 'react';
import { WritableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from 'streamsaver';

const requestDownloadId = async (
  selectedFileList: LogFileList,
): Promise<string | null> => {
  try {
    const {
      data: { downloadId },
    } = await axios.post(
      'http://localhost:3100/service/api/files',
      selectedFileList,
    );
    return downloadId;
  } catch (e) {
    console.error(e);
    return null;
  }
};
const statusGenerator: any = async function* (downloadId: string) {
  while (true) {
    try {
      const response = await axios.get(
        `http://localhost:3100/service/api/files/download/${downloadId}`,
      );
      console.log('response', response);
      if (response.status === 200) {
        const { status } = response?.data;
        console.log('status', status);
        if (status === 'done' || status === 'error') return response;
        else
          yield new Promise(resolve => {
            setTimeout(() => resolve(response), 500);
          });
      } else {
        return response;
      }
    } catch (e) {
      console.error(e);
      return e;
    }
  }
};

export const execFileDownload = (
  selectedFileList: LogFileList,
  cancelInfo: React.MutableRefObject<CancelInfo>,
) => {
  //init cancelInfo
  cancelInfo.current.downloadId = null;
  cancelInfo.current.cancel = false;

  // modal init(pop up)
  const modal = Modal.confirm({
    centered: true,
  });

  // modal info update
  modal.update({
    title: 'File Download',
    content: 'Do you want to download files?',
    onOk: async () => {
      // Request Download => get download id
      const downloadId = await requestDownloadId(selectedFileList);
      console.log('downloadId', downloadId);

      if (!downloadId) {
        // network error
        return;
      }
      console.log('downloadId', downloadId);
      cancelInfo.current.downloadId = downloadId;

      const generator = statusGenerator(downloadId);
      let data;
      while ((data = await generator.next()) && !data.done) {
        if (cancelInfo.current.cancel) {
          cancelInfo.current.downloadId = null;
          cancelInfo.current.cancel = false;
          break;
        }
      }

      console.log('data', data);
      const { status } = data?.value?.data;
      console.log('status', status);
      if (status) {
        if (status === 'done') {
          // get downloadurl
          //alert('get downloadurl');
          downloadFile('http://localhost:3100/service/api/files/store/dsfdf');
        } else if (status === 'error') {
          //download error
          alert('download error');
        }
      } else {
        // network error
        alert('network error');
      }

      // await (async () => {
      //   for await (const result of generator()) {
      //     if (cancel.current) break;
      //     console.log('result', result);
      //     const { status } = result?.data;
      //
      //     if (status) {
      //       if (status === 'done') {
      //         // get downloadurl
      //         alert('get downloadurl');
      //       } else if (status === 'error') {
      //         //download error
      //         alert('download error');
      //       }
      //     } else {
      //       // network error
      //       alert('network error');
      //     }
      //   }
      // })();
    },
    onCancel: async () => {
      cancelInfo.current.cancel = true;
      try {
        const response = await axios.delete(
          `http://localhost:3100/service/api/files/download/${cancelInfo.current.downloadId}`,
        );
      } catch (e) {
        // network error
        console.error(e);
      }
    },
  });
};

const downloadFile = (url: string) => {
  console.log('downloadFile');
  console.log('url', url);
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    //body: JSON.stringify(data),
  })
    .then(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log('contentDisposition', contentDisposition);
      const fileName: string =
        contentDisposition
          ?.substring(contentDisposition.lastIndexOf('=') + 1)
          .replace(/"/g, '') || 'logFile.zip';

      console.log('fileName', fileName);

      // These code section is adapted from an example of the StreamSaver.js
      // https://jimmywarting.github.io/StreamSaver.js/examples/fetch.html

      // If the WritableStream is not available (Firefox, Safari), take it from the ponyfill
      if (!window.WritableStream) {
        streamSaver.WritableStream = WritableStream;
        window.WritableStream = WritableStream;
      }

      const fileStream = streamSaver.createWriteStream(fileName);
      const readableStream = response.body;

      // More optimized
      if (readableStream?.pipeTo) {
        return readableStream.pipeTo(fileStream);
      }

      (window as any).writer = fileStream.getWriter();

      const reader = response?.body?.getReader();
      if (reader) {
        const pump = () =>
          reader
            .read()
            .then(res =>
              res.done
                ? (window as any).writer.close()
                : (window as any).write(res.value).then(pump),
            );

        pump();
      }
    })
    .catch(error => {
      console.log(error);
    });
};
