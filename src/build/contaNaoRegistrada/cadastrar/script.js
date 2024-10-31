const API_URL = "http://localhost:3000";

// Função para cadastrar usuário
async function registerUser() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    alert(data.mensagem);

    // Redirecionar para index2.html após o cadastro
    if (response.ok) {
      window.location.href = "../login/index2.html";
    }
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    alert("Erro ao cadastrar usuário.");
  }
}
