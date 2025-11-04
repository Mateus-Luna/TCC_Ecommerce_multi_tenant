Épico 1 – Gerenciamento de Lojas (Multi-Tenant)

US01: Como administrador do sistema, quero registrar novas lojas para que cada cliente tenha seu próprio ambiente.

US02: Como lojista, quero customizar informações da minha loja (nome, logo, domínio, descrição) para personalizar minha vitrine.

US03: Como sistema, devo isolar os dados de cada loja (clientes, produtos, pedidos) para garantir segurança e privacidade.

US04: Como administrador, quero visualizar e gerenciar todas as lojas cadastradas, podendo desativar ou editar suas configurações.

🔐 Épico 2 – Autenticação e Controle de Acesso

US05: Como usuário (cliente ou lojista), quero criar uma conta e fazer login para acessar minhas funcionalidades.

US06: Como lojista, quero gerenciar permissões de acesso dos meus funcionários (ex.: vendedor, estoquista).

US07: Como cliente, quero recuperar minha senha caso eu a esqueça.

🛍️ Épico 3 – Catálogo de Produtos

US08: Como lojista, quero cadastrar, editar e remover produtos da minha loja.

US09: Como lojista, quero definir categorias e estoques dos produtos.

US10: Como cliente, quero visualizar os produtos disponíveis na loja, com preço, descrição e imagem.

US11: Como cliente, quero filtrar e buscar produtos por nome, categoria ou preço.

🛒 Épico 4 – Carrinho e Checkout

US12: Como cliente, quero adicionar produtos ao carrinho para posterior compra.

US13: Como cliente, quero atualizar quantidades ou remover itens do carrinho antes de finalizar.

US14: Como cliente, quero finalizar o pedido (checkout) informando endereço e forma de pagamento.

📦 Épico 5 – Pedidos e Pagamentos

US15: Como lojista, quero visualizar todos os pedidos recebidos, com status e detalhes.

US16: Como cliente, quero acompanhar o status do meu pedido (ex.: “processando”, “enviado”, “entregue”).

US17: Como cliente, quero realizar o pagamento do pedido utilizando uma forma de pagamento simulada (ex.: mock de gateway).

US18: Como sistema, quero garantir que os pagamentos sejam isolados por loja, sem interferência entre tenants.

📊 Épico 6 – Painel Administrativo

US19: Como lojista, quero visualizar um dashboard com métricas da minha loja (vendas, produtos, pedidos).

US20: Como administrador do sistema, quero monitorar o desempenho e uso de cada loja.

⚙️ Épico 7 – Infraestrutura Multi-Tenant

US21: Como sistema, quero identificar o tenant a partir do subdomínio, token ou cabeçalho para direcionar o contexto corretamente.

US22: Como sistema, quero utilizar um esquema de banco de dados isolado por tenant (ex.: schema ou coluna tenant_id).

US23: Como administrador, quero configurar políticas de segurança e backup separadas para cada loja.

US24: Como sistema, quero monitorar o consumo de recursos por tenant para viabilizar escalabilidade.