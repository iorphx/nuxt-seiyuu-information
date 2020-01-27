export default function ({ store, error }) {
  if (!store.state.authUser) {
    error({
      message: '권한이 없습니다.',
      statusCode: 401
    })
  } else if (store.state.authUser.admin === undefined) {
    error({
      message: '권한이 없습니다.',
      statusCode: 401
    })
  }
}
