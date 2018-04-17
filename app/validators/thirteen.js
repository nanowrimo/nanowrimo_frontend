export default function validateThirteen() {
  return (key, newValue, oldValue, changes, content) => { // eslint-disable-line no-unused-vars
        if (newValue === true) {
      return true;
    }
    return "You must be 13 or older";
  }
}
