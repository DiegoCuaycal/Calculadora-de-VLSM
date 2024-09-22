
const redPrincipalLS =localStorage.getItem('redPrincipal');
const prefijoLS =parseInt(localStorage.getItem('prefijo'));
const numHostsLS = localStorage.getItem('numHostsArray');
const namesLS= localStorage.getItem('namesArray');





//Tranformamos en un arreglo los datos almacenados en LS
const numHostsArrayLS =numHostsLS.split(',').map(Number); 
const namesArrayLS =namesLS.split(',').map(String); 


class Subred {
  constructor(subred, direccionRed, mascara, prefijo, hosts, rangoAsignable,broadcast) {
    this.subred = subred;
    this.direccionRed = direccionRed;
    this.mascara = mascara;
    this.prefijo = prefijo;
    this.hosts = hosts;
    this.rangoAsignable = rangoAsignable;
    this.broadcast= broadcast;
  }
}

class VLSCalculator {
  constructor(redPrincipal, prefijo) {
    this.redPrincipal = this.ipToInt(redPrincipal);
    this.prefijo = prefijo;
    this.subredes = [];
  }

  calcularSubredes(hostsRequeridos) {
    let red = this.redPrincipal;
    for (let i = 0; i < hostsRequeridos.length; i++) {
      let totalHosts = hostsRequeridos[i]; // Número de hosts necesarios para la subred
      let bits = Math.ceil(Math.log2(totalHosts + 2)); // Se suma 2 para incluir la dirección de red y de broadcast
      let prefijoSubred = 32 - bits; 

      if (prefijoSubred < this.prefijo) {
        break;
      }

      let mascara = 0xFFFFFFFF << (32 - prefijoSubred) >>> 0;
      let direccionRed = (red & mascara) >>> 0;
      let direccionPrimera = (direccionRed + 1) >>> 0; // Dirección de primer host asignable
      let direccionUltima = (direccionRed + (Math.pow(2, bits)) -2)>>> 0; // Dirección de último host asignable
      let broadcast = (direccionUltima + 1) >>> 0; 
      this.subredes.push(new Subred(
        i + 1,
        this.intToIP(direccionRed),
        this.intToIP(mascara),
        prefijoSubred,
        totalHosts, // Número de hosts necesarios para la subred
        `${this.intToIP(direccionPrimera)} - ${this.intToIP(direccionUltima)}`,
        this.intToIP(broadcast)
      ));

      direccionRed = (direccionRed + (Math.pow(2, bits))) >>> 0; // Se incrementa la dirección de red para obtener la siguiente subred
      red = direccionRed; // Se actualiza la red principal para el próximo cálculo
    }

    return this.subredes;
  }

  intToIP(num) {
    return (
      ((num >> 24) & 255) +
      "." +
      ((num >> 16) & 255) +
      "." +
      ((num >> 8) & 255) +
      "." +
      (num & 255)
    );
  }

  ipToInt(ip) {
    let partes = ip.split(".");
    return (
      (parseInt(partes[0]) << 24) +
      (parseInt(partes[1]) << 16) +
      (parseInt(partes[2]) << 8) +
      parseInt(partes[3])
    );
  }
}


document.addEventListener("DOMContentLoaded", function() {


  let vlsmCalc = new VLSCalculator(redPrincipalLS, prefijoLS);
  let subredesCalculadas = vlsmCalc.calcularSubredes(numHostsArrayLS);
  console.log("🚀 ~ file: subnetting.js:100 ~ document.addEventListener ~ subredesCalculadas:", subredesCalculadas);


  var formSubnet = document.getElementById("subnetTable");

  var frmDato1 = document.getElementById("frmRedPrincipal");
  var frmDato2 = document.getElementById("frmPrefijo");
  // Asignar el valor del dato al campo del formulario
  frmDato1.value = redPrincipalLS;
  frmDato2.value = prefijoLS;


  var tbody = formSubnet.getElementsByTagName("tbody")[0];

  for (var i = 0; i < namesArrayLS.length; i++) {
    // Crear una fila
    var fila = document.createElement("tr");

    // Crear celdas para cada arreglo y agregar los valores
    var celda1 = document.createElement("td");
    celda1.textContent = namesArrayLS[i];
    fila.appendChild(celda1);

    var celda2 = document.createElement("td");
    celda2.textContent = numHostsArrayLS[i];
    fila.appendChild(celda2);

    var celda3 = document.createElement("td");
    celda3.textContent =  subredesCalculadas[i].direccionRed;
    fila.appendChild(celda3);
    
    var celda4 = document.createElement("td");
    celda4.textContent =  subredesCalculadas[i].mascara;
    fila.appendChild(celda4);

    var celda5 = document.createElement("td");
    celda5.textContent =  subredesCalculadas[i].prefijo;
    fila.appendChild(celda5);
    
    var celda6 = document.createElement("td");
    celda6.textContent =  subredesCalculadas[i].rangoAsignable;
    fila.appendChild(celda6);

    var celda6 = document.createElement("td");
    celda6.textContent =  subredesCalculadas[i].broadcast;
    fila.appendChild(celda6);
    // Agregar la fila al cuerpo de la tabla
    tbody.appendChild(fila);
}


});



