function replaceMark(texto) {
    const tildes = {
      'á': 'a',
      'é': 'e',
      'í': 'i',
      'ó': 'o',
      'ú': 'u',
      'ü': 'u',
      'ñ': 'n'
      // Agrega más caracteres si es necesario
    };
  
    // Utiliza una expresión regular para buscar y reemplazar las tildes
    return texto.replace(/[áéíóúüñ]/g, match => tildes[match]);
  }
  
module.exports = replaceMark;