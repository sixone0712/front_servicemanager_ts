import React, { useEffect, useReducer } from 'react';
import axios, { AxiosResponse } from 'axios';

type State = {
  loading: boolean;
  data: any;
  error: any;
};

type Actions =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: any }
  | { type: 'ERROR'; error: any };

const initialState: State = {
  loading: false,
  data: null,
  error: null,
};

function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      return state;
  }
}

// type AxiosMehtod = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
// type AxiosParams = {
//   method: AxiosMehtod;
//   url: string;
//   data?: any;
// };
//
// function useAsyncAxios(
//   params: AxiosParams,
//   skip = false,
// ): [State, () => Promise<void>] {
//   const [state, dispatch] = useReducer(reducer, initialState);
//
//   const fetchData = async () => {
//     dispatch({ type: 'LOADING' });
//     let data;
//     try {
//       switch (params.method) {
//         case 'GET':
//           data = await axios.get(params.url);
//           console.log('fetchData_data', data);
//           break;
//         case 'POST':
//           data = await axios.post(params.url, params.data);
//           break;
//         case 'PUT':
//           data = await axios.put(params.url, params.data);
//           break;
//         case 'PATCH':
//           data = await axios.patch(params.url, params.data);
//           break;
//         case 'DELETE':
//           data = await axios.delete(params.url);
//           break;
//         default:
//           throw new Error(`Method Error: ${params.method}`);
//       }
//       console.log('data', data);
//       dispatch({ type: 'SUCCESS', data });
//     } catch (e) {
//       dispatch({ type: 'ERROR', error: e });
//     }
//   };
//
//   useEffect(() => {
//     if (skip) return;
//     fetchData().then(r => r);
//   }, [params]);
//
//   return [state, fetchData];
// }

function useAsyncAxios(
  callback: () => Promise<AxiosResponse<any>>,
  deps: any[],
  skip = false,
): [State, () => Promise<any>] {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async () => {
    try {
      dispatch({ type: 'LOADING' });
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    if (skip) return;
    fetchData().then(r => r);
  }, deps);

  return [state, fetchData];
}

export default useAsyncAxios;
