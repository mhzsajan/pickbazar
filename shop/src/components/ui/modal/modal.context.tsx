import React from 'react';

type MODAL_VIEWS =
  | 'REGISTER'
  | 'LOGIN_VIEW'
  | 'FORGOT_VIEW'
  | 'OTP_LOGIN'
  | 'ADD_OR_UPDATE_ADDRESS'
  | 'ADD_OR_UPDATE_CHECKOUT_CONTACT'
  | 'ADD_OR_UPDATE_PROFILE_CONTACT'
  | 'ADD_OR_UPDATE_GUEST_ADDRESS'
  | 'LOCATION_BASED_SHOP'
  | 'DELETE_ADDRESS'
  | 'PRODUCT_DETAILS'
  | 'REFUND_REQUEST'
  | 'REVIEW_RATING'
  | 'QUESTION_FORM'
  | 'ABUSE_REPORT'
  | 'SHOP_INFO'
  | 'SELECT_PRODUCT_VARIATION'
  | 'REVIEW_IMAGE_POPOVER'
  | 'USE_NEW_PAYMENT'
  | 'PAYMENT_MODAL'
  | 'STRIPE_ELEMENT_MODAL'
  | 'DELETE_CARD_MODAL'
  | 'ADD_NEW_CARD'
  | 'ADD_NEW_CARD_DURING_PAYMENT'
  | 'USE_SAVED_CARD'
  | 'GATEWAY_MODAL'
  | 'NEWSLETTER_MODAL'
  | 'PROMO_POPUP_MODAL'
  | 'REVIEW_POPUP_MODAL';

interface State {
  view?: MODAL_VIEWS;
  data?: any;
  isOpen: boolean;
}
type Action =
  | { type: 'open'; view?: MODAL_VIEWS; payload?: any }
  | { type: 'close' };

const initialState: State = {
  view: undefined,
  isOpen: false,
  data: null,
};

function modalReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        view: action.view,
        data: action.payload,
        isOpen: true,
      };
    case 'close':
      return {
        ...state,
        view: undefined,
        data: null,
        isOpen: false,
      };
    default:
      throw new Error('Unknown Modal Action!');
  }
}

const ModalStateContext = React.createContext<State>(initialState);
ModalStateContext.displayName = 'ModalStateContext';
const ModalActionContext = React.createContext<
  React.Dispatch<Action> | undefined
>(undefined);
ModalActionContext.displayName = 'ModalActionContext';

export const ModalProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(modalReducer, initialState);
  const isOpenRef = React.useRef(false);
  const isHandlingPopState = React.useRef(false);

  React.useEffect(() => {
    function handlePopState(e: PopStateEvent) {
      if (isOpenRef.current && e.state?.__modal) {
        isHandlingPopState.current = true;
        dispatch({ type: 'close' });
        isOpenRef.current = false;
        setTimeout(() => {
          isHandlingPopState.current = false;
        }, 0);
      }
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const wrappedDispatch = React.useCallback(
    (action: Action) => {
      if (action.type === 'open') {
        if (!isOpenRef.current) {
          isOpenRef.current = true;
          window.history.pushState({ __modal: true }, '');
        }
      } else if (action.type === 'close') {
        if (isOpenRef.current && !isHandlingPopState.current) {
          isOpenRef.current = false;
          window.history.back();
        } else if (isHandlingPopState.current) {
          isOpenRef.current = false;
        }
      }
      dispatch(action);
    },
    [dispatch],
  );

  return (
    <ModalStateContext.Provider value={state}>
      <ModalActionContext.Provider value={wrappedDispatch}>
        {children}
      </ModalActionContext.Provider>
    </ModalStateContext.Provider>
  );
};

export function useModalState() {
  const context = React.useContext(ModalStateContext);
  if (context === undefined) {
    throw new Error(`useModalState must be used within a ModalProvider`);
  }
  return context;
}

export function useModalAction() {
  const dispatch = React.useContext(ModalActionContext);
  if (dispatch === undefined) {
    throw new Error(`useModalAction must be used within a ModalProvider`);
  }
  return {
    openModal(view?: MODAL_VIEWS, payload?: unknown) {
      dispatch({ type: 'open', view, payload });
    },
    closeModal() {
      dispatch({ type: 'close' });
    },
  };
}
