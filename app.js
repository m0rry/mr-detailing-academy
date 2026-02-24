/
function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
