// Método para agregar y quitar filas en el formulario
function setupChangeSubnetEvent() {
  var changeSubnetBtn = document.getElementById('changeSubnetBtn');
  if (changeSubnetBtn) {
      changeSubnetBtn.addEventListener('click', function () {
          var numSubnets = document.getElementById('numSubnet').value;

          // Obtener la tabla
          var table = document.getElementById('subnetTable');

          // Eliminar todas las filas existentes
          while (table.rows.length > 1) {
              table.deleteRow(1);
          }

          // Generar nuevas filas
          for (var i = 1; i <= numSubnets; i++) {
              let row = table.insertRow(-1);
              let cell1 = row.insertCell(0);
              let cell2 = row.insertCell(1);
              cell1.innerHTML = '<input type="text" name="net_' + i + '" class="name">';
              cell2.innerHTML = '<input type="text" name="size_' + i + '" class="size">';
          }

          // Añadir la fila del número de subredes
          let row = table.insertRow(-1);
          let cell1 = row.insertCell(0);
          let cell2 = row.insertCell(1);
          cell1.innerHTML = '<td>Numero de subredes</td>';
          cell2.innerHTML = '<td><input type="number" name="numSubnet" id="numSubnet" value="' + numSubnets + '"><button type="button" id="changeSubnetBtn">Cambiar</button></td>';

          // Volver a configurar el evento
          setupChangeSubnetEvent();
      });
  }
}

// Configurar el evento inicial
setupChangeSubnetEvent();

// Método para verificar si es válida una dirección IPv4
function isValidIPv4(address) {
  const octets = address.split('.');

  // Verificar que haya exactamente 4 octetos
  if (octets.length !== 4) {
      return false;
  }

  // Verificar que cada octeto sea un número entre 0 y 255
  for (const octet of octets) {
      const numericValue = parseInt(octet, 10);

      if (isNaN(numericValue) || numericValue < 0 || numericValue > 255) {
          return false;
      }
  }

  return true;
}




// Método para manejar el envío del formulario
document.getElementById('submit').addEventListener('click', function () {
  // Recuperar red padre y prefijo
  let majorNetwork = document.getElementById('majorNetwork').value;
  let prefix = document.getElementById('prefix').value;

  // Almacenar nombres de los hosts y su valor
  const hosts = [];
  let hostRows = document.querySelectorAll('.name');
  let numHostsRows = document.querySelectorAll('.size');

  // Verificar que todos los campos estén completos
  let isValid = true;
  hostRows.forEach((hostInput, index) => {
      let hostName = hostInput.value;
      let numHosts = numHostsRows[index].value;

      if (hostName.trim() === '' || numHosts.trim() === '') {
          isValid = false;
          alert('Por favor, complete todos los campos para los hosts.');
          return;
      } else {
          hosts.push({ name: hostName, numHosts: numHosts });
      }
  });

  // Verificar que el formato ingresado de la red sea correcto
  if (!isValidIPv4(majorNetwork)) {
      alert('La dirección IP proporcionada no es válida. Asegúrese de usar el formato CIDR (Ejemplo: 192.168.0.1/24)');
      return;
  }

  // Comprobar que el prefijo sea un número válido entre 1 y 32
  if (isNaN(prefix) || prefix < 1 || prefix > 32) {
      alert('El prefijo es inválido. Por favor, ingrese un número entre uno y 32.');
      document.getElementById('prefix').value = ''; // Reiniciar el campo del prefijo
      return;
  }

  // Continuar solo si todos los campos son válidos
  if (!isValid) {
      return;
  }

const jsonHosts = JSON.stringify(hosts);
// Parsear el JSON a un arreglo de objetos
const data = JSON.parse(jsonHosts);
// Ordenar los valores de numHosts en orden descendente
data.sort((a, b) => parseInt(b.numHosts) - parseInt(a.numHosts));
//Guarda los valores ordenados de los host y de los nombres
const numHostsArray = data.map(item => parseInt(item.numHosts));
const namesArray = data.map(item => item.name);

//Realiza el cálculo de división de subredes

//Guardar datos en local storage

localStorage.setItem('redPrincipal', majorNetwork);
localStorage.setItem('prefijo', prefix);
localStorage.setItem('numHostsArray', numHostsArray);
localStorage.setItem('namesArray', namesArray);

//Redirigir a la siguiente página
window.location.href = 'subnetting.html';




});


