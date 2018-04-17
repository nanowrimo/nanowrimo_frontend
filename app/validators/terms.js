export default function validateTerms() {
  return (key, newValue, oldValue, changes, content) => { // eslint-disable-line no-unused-vars
        if (newValue === true) {
      return true;
    }
    return "You must accept the terms and conditions.";
  }
}
