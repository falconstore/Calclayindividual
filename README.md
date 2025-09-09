# 🎯 Calculadora de Proteção Múltipla

Uma calculadora avançada para estratégias de apostas com proteção múltipla, permitindo equilibrar lucros entre diferentes cenários usando freebets e apostas LAY/BACK.

## 📋 Funcionalidades

- **Cálculo automático de stakes** para equilibrar lucros entre cenários
- **Suporte a freebets** com percentual customizável (0-100%)
- **Apostas LAY e BACK** com comissões configuráveis
- **Múltiplas proteções** (2-6 proteções simultâneas)
- **Compartilhamento de configurações** via URL
- **Interface responsiva** com tema claro/escuro
- **Modo debug** para análise detalhada dos cálculos

## 🚀 Como usar

1. **Configure a múltipla principal:**
   - Insira a odd da múltipla
   - Defina o stake inicial
   - Marque se é uma freebet

2. **Configure as proteções:**
   - Defina as odds das proteções
   - Escolha entre BACK ou LAY
   - Configure comissões quando aplicável
   - Marque freebets quando necessário

3. **Ajuste parâmetros:**
   - Percentual de freebet (impacta o valor líquido recebido)
   - Arredondamento dos stakes calculados
   - Número de proteções ativas

4. **Analise os resultados:**
   - Veja os stakes calculados automaticamente
   - Compare lucros em cada cenário
   - Monitore o lucro mínimo garantido

## 🎲 Estratégia

A calculadora implementa uma estratégia de **proteção múltipla** que:

1. **Múltipla Principal:** Aposta com odd alta (pode ser freebet)
2. **Proteções:** Apostas que equilibram os resultados negativos
3. **Freebets:** Maximizam lucro sem risco adicional do próprio dinheiro
4. **Resultado:** Lucro positivo protegido em todos os cenários possíveis

### Exemplo de uso:
- Múltipla @4.25 com R$ 100 (freebet 70%)
- Proteção 1: LAY @1.95 (freebet)
- Proteção 2: BACK @2.80 (2.5% comissão)
- Proteção 3: BACK @2.10

A calculadora equilibra automaticamente os stakes para garantir lucro similar em qualquer resultado.

## 🔧 Estrutura do projeto

```
/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos e temas
├── js/
│   ├── utils.js        # Funções utilitárias
│   ├── calculator.js   # Lógica de cálculo
│   ├── ui.js          # Interface e renderização
│   └── main.js        # Inicialização
└── README.md          # Este arquivo
```

## 🎨 Temas

A calculadora suporta dois temas:
- **Tema Escuro** (padrão): Melhor para uso prolongado
- **Tema Claro**: Interface mais limpa para apresentações

Alterne clicando no botão no canto superior direito.

## 🔍 Modo Debug

Ative o modo debug com **duplo clique no título** para ver:
- Estado interno dos cálculos
- Verificação de lucros por cenário
- Análise de equilibrio entre apostas
- Informações detalhadas sobre freebets

## 🌐 Compartilhamento

Use o botão "🔗 Compartilhar" para gerar um link com sua configuração atual. Isso permite:
- Salvar configurações específicas
- Compartilhar estratégias com outros usuários
- Criar backups de configurações complexas

## 📱 Compatibilidade

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móveis (responsivo)
- ✅ Funciona offline após primeiro carregamento
- ✅ Não requer instalação ou servidor

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## ⚠️ Aviso

Esta calculadora é uma ferramenta auxiliar para cálculos matemáticos. Sempre:
- Verifique os cálculos manualmente
- Entenda os riscos das estratégias
- Aposte com responsabilidade
- Respeite as leis locais sobre apostas

## 🔗 Links úteis

- [Demo Online](https://seu-usuario.github.io/calculadora-protecao-multipla)
- [Reportar Bug](https://github.com/seu-usuario/calculadora-protecao-multipla/issues)
- [Solicitar Funcionalidade](https://github.com/seu-usuario/calculadora-protecao-multipla/issues/new)

---

Desenvolvido com ❤️ para a comunidade de apostas estratégicas.
