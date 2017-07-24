import { ATOMIC } from '../storeType';
import { triggerToaster } from '../actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';
import Config from '../../config';

export function atomic(payload) {
  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'atomic',
      'type': 'post',
      'url': `http://127.0.0.1:${Config.iguanaCorePort}`,
      'payload': payload,
      'status': 'pending',
    }));

    return fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'error',
        'response': error,
      }));
      dispatch(
        triggerToaster(
          payload.method,
          translate('API.ATOMIC_EXPLORER_ERR'),
          translate('API.ERROR_SM')
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(atomicState(json));
    });
  }
}

function atomicState(json) {
  return {
    type: ATOMIC,
    response: json,
  }
}