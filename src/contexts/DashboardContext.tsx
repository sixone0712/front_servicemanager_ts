import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import produce from 'immer';

export type Device = {
  key: string;
  type: string;
  name: string;
  ip: string;
  status: string[];
  volume: string;
};

export type DeviceList = Device[];

export type LogDown = {
  selectedDevice: string | null;
  deviceList: DeviceList;
};

const initialState: LogDown = {
  selectedDevice: null,
  deviceList: [],
};

const LogDownStateContext = createContext<LogDown | undefined>(undefined);

type Action =
  | { type: 'SELECT_DEVICE'; selectedDevice: string | null }
  | { type: 'SET_DEVICE_LIST'; deviceList: DeviceList };

type LogDownDispatch = Dispatch<Action>;
const LogDownDispatchContext = createContext<LogDownDispatch | undefined>(
  undefined,
);

function logDownReducer(state: LogDown, action: Action): LogDown {
  switch (action.type) {
    case 'SELECT_DEVICE':
      return produce(state, draft => {
        draft.selectedDevice = action.selectedDevice;
      });
    case 'SET_DEVICE_LIST':
      return produce(state, draft => {
        draft.deviceList = action.deviceList;
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
  const [state, dispatch] = useReducer(logDownReducer, initialState);

  return (
    <LogDownDispatchContext.Provider value={dispatch}>
      <LogDownStateContext.Provider value={state}>
        {children}
      </LogDownStateContext.Provider>
    </LogDownDispatchContext.Provider>
  );
}

// LogDown Custom Hook
export function useDashBoardState(): LogDown {
  const state = useContext(LogDownStateContext);
  if (!state) throw new Error('LogDownStateContext not found');
  return state;
}

export function useLDashBoardDispatch(): React.Dispatch<Action> {
  const dispatch = useContext(LogDownDispatchContext);
  if (!dispatch) throw new Error('LogDownDispatchContext not found');
  return dispatch;
}
