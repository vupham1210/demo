import { call, put, takeEvery, takeLatest  } from 'redux-saga/effects';
/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/

function * VerifyRefreshToken(action){
  console.log(action);
}

function* mySaga() {
  yield takeEvery("loginuser/fulfilled", async (action) => {
  });

  yield takeEvery("updateUser/pending", async (action) => {
  });

}

export default mySaga;