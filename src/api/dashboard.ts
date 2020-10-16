import { DeviceList } from '../contexts/DashboardContext';
import { LogFileList, LogType } from '../components/Dashboard/LogTable';

export function getDeviceList(): Promise<any> {
  // axios.get
  const data = [
    {
      key: 'ESP_01',
      type: 'ESP',
      name: 'ESP_01',
      ip: '10.1.31.143',
      status: [
        'Rapid Collector (Up 12 seconds)',
        'Postgres (Exited 12 seconds)',
      ],
      volume: '100G / 500G',
    },
    {
      key: 'OTS_01',
      type: 'OTS',
      name: 'OTS_01',
      ip: '10.1.31.144',
      status: ['File Service Collect (Up 12 seconds)'],
      volume: '100G / 500G',
    },
    {
      key: 'OTS_02',
      type: 'OTS',
      name: 'OTS_02',
      ip: '10.1.31.144',
      status: ['File Service Collect (Up 12 seconds)'],
      volume: '100G / 500G',
    },
    {
      key: 'OTS_03',
      type: 'OTS',
      name: 'OTS_03',
      ip: '10.1.31.144',
      status: ['File Service Collect (Up 12 seconds)'],
      volume: '100G / 500G',
    },
    {
      key: 'OTS_04',
      type: 'OTS',
      name: 'OTS_04',
      ip: '10.1.31.144',
      status: ['Unknown'],
      volume: '100G / 500G',
    },
    {
      key: 'OTS_05',
      type: 'OTS',
      name: 'OTS_05',
      ip: '10.1.31.144',
      status: ['File Service Collect (Up 12 seconds)'],
      volume: '100G / 500G',
    },
  ];

  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve({ data: data });
    }, 1000);
  });
}

export function getLogFileList(device: string | null): Promise<any> {
  const data: LogFileList = [];

  let cnt = 0;
  for (let i = 0; i < 7; i++) {
    data.push({
      key: cnt,
      fileType: LogType.LOGIN_OUT,
      fileName: `${device}_login_out_${i}.log`,
      fileSize: `24 KB`,
    });
    cnt++;
  }

  for (let i = 0; i < 7; i++) {
    data.push({
      key: cnt,
      fileType: LogType.USER_JOB,
      fileName: `${device}_user_job_${i}.log`,
      fileSize: `24 KB`,
    });
    cnt++;
  }

  for (let i = 0; i < 7; i++) {
    data.push({
      key: cnt,
      fileType: LogType.DOWNLOADED_FILE,
      fileName: `${device}_download_file_${i}.log`,
      fileSize: `24 KB`,
    });
    cnt++;
  }

  for (let i = 0; i < 7; i++) {
    data.push({
      key: cnt,
      fileType: LogType.ESP_OTS_PROCESS,
      fileName: `${device}_esp_ots_process_${i}.log`,
      fileSize: `24 KB`,
    });
    cnt++;
  }

  for (let i = 0; i < 7; i++) {
    data.push({
      key: cnt,
      fileType: LogType.DOWNLOAD_FILE_STATUS,
      fileName: `${device}_download_file_status_${i}.log`,
      fileSize: `24 KB`,
    });
    cnt++;
  }

  for (let i = 0; i < 7; i++) {
    data.push({
      key: cnt,
      fileType: LogType.ERROR,
      fileName: `${device}_error_exception_${i}.log`,
      fileSize: `24 KB`,
    });
    cnt++;
  }

  for (let i = 0; i < 7; i++) {
    data.push({
      key: cnt,
      fileType: LogType.TOMCAT,
      fileName: `${device}_tomcat_${i}.log`,
      fileSize: `24 KB`,
    });
    cnt++;
  }

  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve({ data: data });
    }, 1000);
  });
}
