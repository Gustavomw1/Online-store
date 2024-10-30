import { Request, Response, Router } from "express";
import { AppDataSource } from "../../database/data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "tools";
const db = AppDataSource;
const userRouter = Router();

// Ver usuarios
userRouter.get("/profile", async (_req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM usuarios;");
    return res.status(200).json({ result });
  } catch (erro) {
    return res
      .status(500)
      .json({ mensagem: "Erro ao buscar perfis de usuário" });
  }
});

// Cadastrar usuario
userRouter.post("/register", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  // Hasheando a senha
  const hashedPassword = await bcrypt.hash(senha, 10);

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
  }

  try {
    const query = "INSERT INTO usuarios (email, senha) VALUES ($1, $2)";
    const result = await db.query(query, [email, hashedPassword]);

    return res
      .status(201)
      .json({ mensagem: `Usuário criado com sucesso ${result.insertId}` });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
  }
});

// Verificação JWT - Login
userRouter.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    const usuario = result[0]; // Acessando o primeiro resultado diretamente

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // Verifica a senha usando bcrypt
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    // Gera um token JWT
    const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: "1h" });

    return res
      .status(200)
      .json({ mensagem: "Usuário logado com sucesso", token });
  } catch (erro) {
    console.error("Erro ao logar usuário:", erro);
    return res.status(500).json({ mensagem: "Erro ao logar usuário" });
  }
});

// Deletar usuario
userRouter.delete("/profile/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
  } catch {
    res.status(401).json({ erro: "Erro ao deletar usuário" });
  }
});

export default userRouter;
