let CPFLabel;
let CPFText;
let CPFButton;
let CPFButtonCopy;

function randomRange(min, max){
	return min + Math.floor(Math.random() *(max - min + 1));
}

function randomCPF(){
	let cpf = '';
	for(let i = 0; i < 9; i++){
		randomDigit = randomRange(0, 9);
		cpf = cpf.concat(String(randomDigit));
	}
	return cpf;
}

function removeMultiple(str, chars){
	if(typeof str !== 'string'){
		throw new Error("str must be a string");
	}
	if(!chars || !(chars instanceof Array) || (!chars.length && chars.length!==0)){
		throw new Error("chars must be an array");
	}
	
	if(!chars.length) {
		return str;
	}

	str = str.replaceAll(chars[0], '');
	return removeMultiple(str, chars.slice(1));
}

function addVerifierDigits(cpf){
	cpf = removeMultiple(String(cpf), ['.', '-']);
	if(cpf.length !== 9){
		throw new Error("CPF deve ter 9 digitos");
	}
	for(let i = 0; i < cpf.length; i++){
		if(!Number.isInteger(Number(cpf[i]))){
			throw new Error("CPF deve conter apenas numeros");
		}
	}

	cpfVerificado = cpf.slice();
	
	let somaVerificacao1 = 0;
	for(let i = 0; i < 9; i++){
		somaVerificacao1 += Number(cpf[i]) * (10 - i);
	}

	const restoDigito1 = somaVerificacao1 % 11;
	const numeroVerificador1 = restoDigito1 < 2 ? 0 : 11 - restoDigito1;

	cpfVerificado += String(numeroVerificador1);

	let somaVerificacao2 = numeroVerificador1 * 2;
	for(let i = 0; i < 9; i++){
		somaVerificacao2 += Number(cpf[i]) * (11 - i);
	}

	const restoDigito2 = somaVerificacao2 % 11;
	const numeroVerificador2 = restoDigito2 < 2 ? 0 : 11 - restoDigito2;

	cpfVerificado += String(numeroVerificador2);

	return cpfVerificado;
}

function copyToClipboard(text) {
	navigator.clipboard.writeText(text);
}

function formatCPF(unformattedCPF){
	return unformattedCPF.slice(0,3) + '.' + unformattedCPF.slice(3,6) + '.' + unformattedCPF.slice(6,9) + '-' + unformattedCPF.slice(9,11);
}

function generateCPF(){
	let cpf = randomCPF();
	let complete_cpf = addVerifierDigits(cpf);
	CPFText.nodeValue = formatCPF(complete_cpf);
}

async function mainCPF() {
	CPFLabel = document.getElementById('CPFLabel');
	CPFText = document.createTextNode('');
	generateCPF();
	CPFButton = document.getElementById('CPFButton');
	CPFLabel.appendChild(CPFText);
	CPFButton.addEventListener('click', generateCPF);
	CPFButtonCopy = document.getElementById('CPFButtonCopy');
	CPFButtonCopy.addEventListener('click', () => copyToClipboard(CPFText.nodeValue));
}

async function main(){
	await mainCEP();
	await mainCPF();
}

window.onload = main;
