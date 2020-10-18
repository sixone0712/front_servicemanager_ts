import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import produce from 'immer';
import axios from 'axios';

export type Device = {
  key: string;
  type: string;
  name: string;
  ip: string;
  status: string[];
  volume: string;
};

export type DeviceList = Device[];

export type DeviceInfo = {
  list: DeviceList;
  selected: string | null;
  pending: boolean;
  success: boolean;
  failure: boolean;
  error: any;
};

type DashBoardState = {
  deviceInfo: DeviceInfo;
};

const initialState: DashBoardState = {
  deviceInfo: {
    list: [],
    selected: null,
    pending: false,
    success: false,
    failure: false,
    error: null,
  },
};

const DashBoardStateContext = createContext<DashBoardState | undefined>(
  undefined,
);

type DashBoardAction =
  | { type: 'GET_DEVICE_LIST' }
  | { type: 'GET_DEVICE_LIST_SUCCESS'; data: any }
  | { type: 'GET_DEVICE_LIST_FAILURE'; error: any }
  | { type: 'SELECT_DEVICE'; selected: string | null };

type DashBoardDispatch = Dispatch<DashBoardAction>;

const DashBoardDispatchContext = createContext<DashBoardDispatch | undefined>(
  undefined,
);

function dashBoardReducer(
  state: DashBoardState = initialState,
  action: DashBoardAction,
): DashBoardState {
  switch (action.type) {
    case 'GET_DEVICE_LIST':
      return produce(state, draft => {
        draft.deviceInfo.pending = true;
        draft.deviceInfo.success = false;
        draft.deviceInfo.failure = false;
      });
    case 'GET_DEVICE_LIST_SUCCESS':
      return produce(state, draft => {
        draft.deviceInfo.pending = false;
        draft.deviceInfo.success = true;
        draft.deviceInfo.failure = false;
        draft.deviceInfo.list = action.data;
        draft.deviceInfo.error = null;
      });
    case 'GET_DEVICE_LIST_FAILURE':
      return produce(state, draft => {
        draft.deviceInfo.pending = false;
        draft.deviceInfo.success = false;
        draft.deviceInfo.failure = true;
        draft.deviceInfo.list = [];
        draft.deviceInfo.error = action.error;
      });
    case 'SELECT_DEVICE':
      return produce(state, draft => {
        draft.deviceInfo.selected = action.selected;
      });
    default:
      return state;
  }
}

export function DashBoardContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = useReducer(dashBoardReducer, initialState);

  return (
    <DashBoardDispatchContext.Provider value={dispatch}>
      <DashBoardStateContext.Provider value={state}>
        {children}
      </DashBoardStateContext.Provider>
    </DashBoardDispatchContext.Provider>
  );
}

// LogDown Custom Hook
export function useDashBoardState(): DashBoardState {
  const state = useContext(DashBoardStateContext);
  if (!state) throw new Error('DashBoardStateContext not found');
  return state;
}

export function useLDashBoardDispatch(): React.Dispatch<DashBoardAction> {
  const dispatch = useContext(DashBoardDispatchContext);
  if (!dispatch) throw new Error('DashBoardDispatchContext not found');
  return dispatch;
}

export async function loadDeviceList(
  dispatch: React.Dispatch<DashBoardAction>,
) {
  dispatch({ type: 'GET_DEVICE_LIST' });
  try {
    const response = await axios.get(
      'https://a1aca22c-c5d4-4414-9a2d-603e0cf3e8a4.mock.pstmn.io/service/api/devices',
    );
    dispatch({ type: 'GET_DEVICE_LIST_SUCCESS', data: response?.data?.lists });
  } catch (e) {
    dispatch({ type: 'GET_DEVICE_LIST_FAILURE', error: e });
  }
}
