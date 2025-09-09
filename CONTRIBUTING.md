# 🤝 Contribuindo

Obrigado por considerar contribuir com a Calculadora de Proteção Múltipla! Suas contribuições ajudam a tornar esta ferramenta melhor para toda a comunidade.

## 🚀 Como contribuir

### Reportando bugs

Se você encontrou um bug, por favor:

1. **Verifique** se o bug já foi reportado nas [Issues](https://github.com/seu-usuario/calculadora-protecao-multipla/issues)
2. **Crie uma nova issue** com:
   - Título descritivo
   - Descrição detalhada do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Navegador/dispositivo usado

### Sugerindo melhorias

Para sugerir uma nova funcionalidade:

1. **Abra uma issue** com label "enhancement"
2. **Descreva** a funcionalidade desejada
3. **Explique** por que seria útil
4. **Forneça** exemplos de uso se possível

### Contribuindo com código

#### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/calculadora-protecao-multipla.git
cd calculadora-protecao-multipla
```

#### 2. Configurar ambiente de desenvolvimento

```bash
# Instalar dependências (opcional, para linting)
npm install

# Iniciar servidor local
npm run dev
# ou
python -m http.server 8000
```

#### 3. Criar branch

```bash
git checkout -b feature/minha-nova-funcionalidade
# ou
git checkout -b fix/corrigir-bug
```

#### 4. Fazer mudanças

- Mantenha o código limpo e bem comentado
- Siga os padrões existentes de formatação
- Teste suas mudanças em diferentes navegadores
- Verifique se funciona em dispositivos móveis

#### 5. Testar

```bash
# Verificar JavaScript (se tiver eslint instalado)
npm run lint:js

# Verificar CSS
npm run lint:css

# Formatar código
npm run format
```

#### 6. Commit e Push

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
# ou
git commit -m "fix: corrige bug Y"

git push origin feature/minha-nova-funcionalidade
```

#### 7. Abrir Pull Request

1. Vá para o GitHub e abra um Pull Request
2. Escolha um título descritivo
3. Explique as mudanças realizadas
4. Referencie issues relacionadas (ex: `Closes #123`)

## 📋 Padrões de código

### JavaScript
- Use `const` e `let` em vez de `var`
- Prefira arrow functions quando apropriado
- Use template literals para strings
- Mantenha funções pequenas e focadas
- Comente código complexo

### CSS
- Use variáveis CSS para cores e espaçamentos
- Mantenha seletores específicos
- Agrupe propriedades relacionadas
- Use nomes de classes descritivos

### Commits
Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação, sem mudanças funcionais
- `refactor:` refatoração de código
- `test:` adicionar ou modificar testes
- `chore:` tarefas de manutenção

## 🏗️ Estrutura do projeto

```
/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos centralizados
├── js/
│   ├── utils.js        # Funções utilitárias
│   ├── calculator.js   # Lógica de cálculo
│   ├── ui.js          # Interface e DOM
│   └── main.js        # Inicialização
├── docs/              # Documentação adicional
└── assets/           # Imagens, ícones, etc.
```

## 🎯 Áreas que precisam de ajuda

- **Testes automatizados**: Implementar testes unitários
- **Validação de entrada**: Melhorar validação de dados
- **Performance**: Otimizar cálculos complexos
- **Acessibilidade**: Melhorar suporte a leitores de tela
- **Internacionalização**: Suporte a outros idiomas
- **Mobile**: Melhorar experiência em dispositivos móveis

## ❓ Dúvidas

Se tiver dúvidas:

1. Verifique a documentação existente
2. Procure em issues fechadas
3. Abra uma nova issue com label "question"
4. Entre em contato via email (se disponível)

## 🙏 Agradecimentos

Todas as contribuições são valiosas, desde correções de typos até novas funcionalidades complexas. Obrigado por ajudar a melhorar este projeto!

## 📄 Código de conduta

Este projeto adere ao código de conduta do Contributor Covenant. Ao participar, você concorda em manter um ambiente respeitoso e acolhedor para todos.

---

**Lembre-se**: Cada contribuição, por menor que seja, faz a diferença! 🚀
