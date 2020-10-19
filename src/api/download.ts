import { Modal } from 'antd';
import axios from 'axios';

const requestDownloadId = async (selectedfileList: any) => {
  try {
    const {
      data: { downloadId },
    } = await axios.post(
      'http://localhost:3100/service/api/files',
      selectedfileList,
    );
    return downloadId;
  } catch (e) {
    console.error(e);
    return '';
  }
};

export const execFileDownload = (selectedfileList: any, cancel: any) => {
  const modal = Modal.confirm({
    centered: true,
  });
  //ModalConfirm({
  modal.update({
    title: 'File Download',
    content: 'Do you want to download files?',
    onOk: async () => {
      // Request Download => get download id

      // const {
      //   data: { downloadId },
      // } = await axios.post(
      //   'http://localhost:3100/service/api/files',
      //   selectedfileList,
      // );

      const downloadId = await requestDownloadId(selectedfileList);
      console.log('downloadId', downloadId);

      if (!downloadId) {
        return;
      }
      console.log('downloadId', downloadId);
      // Request Status
      const statusFunc = () => {
        return axios(
          'http://localhost:3100/service/api/files/download/dl20201019',
        );
      };

      const generator = async function* () {
        while (true) {
          const response = await axios(
            'http://localhost:3100/service/api/files/download/dl20201019',
          );

          console.log('response', response);
          if (response.status === 200) {
            const { status } = response?.data;
            console.log('status', status);
            if (status === 'done' || status === 'error') return response;
            else yield response;
          } else {
            return response;
          }

          yield new Promise(resolve => {
            setTimeout(resolve(response), 500);
          });
        }
      };

      const test = generator();
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());
      console.log(await test.next());

      // await (async () => {
      //   for await (const result of generator()) {
      //     if (cancel.current) break;
      //     console.log('result', result);
      //   }
      // })();

      /*
            const iterator: any = geneDownloadStatus(statusFunc);
            const next = ({ value, done }: { value: any; done: any }) => {
              console.log('[geneDownloadStatus]done', done);
              // console.log(
              //   '[geneDownloadStatus]cancelRef.current',
              //   cancelRef.current,
              // );

              // if (cancelRef.current) {
              //   return;
              // }

              if (done) {
                console.log('[geneDownloadStatus]value', value);
                if (value.status === 200) {
                  if (value.data.status === 'error') {
                    // openDownloadStatusError();
                    return;
                  }
                  // openDownloadComplete();
                } else {
                  // openDownloadStatusError();
                  return;
                }
              } else {
                console.log('[geneDownloadStatus]success');
                value
                  .then((res: any) => {
                    console.log('[geneDownloadStatus]then.value', res);
                    // setDownStatus(res.data);
                    next(iterator.next(res));
                  })
                  .catch((err: any) => {
                    console.log('[geneDownloadStatus]error.value', err);
                    // next(iterator.next(err.response));
                  });
              }
            };

            return next(iterator.next());

            // Download Files

            // return new Promise((resolve, reject) => {
            //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            // }).catch(() => console.log('Oops errors!'));
             */
    },
    onCancel: () => {
      cancel.current = true;
    },
  });
};
