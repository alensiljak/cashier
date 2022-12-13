/*
Items to help out with error handling
*/

function errorAsString(err: any): string {
  let msg
  if (err instanceof String) {
    msg = err
  } else if (err instanceof Object) {
    if (err.hasOwnProperty('message')) {
      msg = err.message
    } else if (err.hasOwnProperty('error')) {
      msg = err.error
    } else {
      msg = 'unknown error object'
    }
  } else {
    // get the string representation
    msg = err + ''
  }

  return msg
}

export { errorAsString }
