const getOnlyText = (element) => {
    let text = element.trim();
    text = text?.replace(/\n/g, "");
    text = text?.replace(/\s\s+/g, " ");
    return text;
}
 
module.exports = { getOnlyText };