function validateURL(urlAnswer) {
    const rootURL = "https://www.viabcp.com";
  
    if (urlAnswer && !urlAnswer.startsWith(rootURL)) {
      return `${rootURL}${urlAnswer}`;
    }
  
    return urlAnswer;
  }
 
module.exports = { validateURL };
