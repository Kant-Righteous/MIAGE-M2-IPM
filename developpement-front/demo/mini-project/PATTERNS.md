# Mini Project：架构与八种设计模式分析

## 1. 项目范围与实现总览

项目是一个无后端的 React 商业站点，通过 React Router 提供首页、商品页和订单页。初始商品来自 JSON；运行期间的商品库存与订单保存在内存中，供三个页面共享。页面跳转保留共享数据，整页刷新会重新初始化数据。

主要架构采用轻量 MVC。其他设计模式分别用于共享数据、订单构建、规则验证、动作封装、变更通知和提交状态管理。

| Pattern | 类型 | 当前实现 | 主要代码位置 |
|---|---|---|---|
| MVC（模型—视图—控制器） | 架构模式 | 已采用，按 React 的组件与 Hook 组织 | Model 模块、两个 Controller Hook、页面与展示组件 |
| Singleton（单例） | 创建型 | 已实现，限制在当前模块实例范围 | `ShopStore` |
| Abstract Factory（抽象工厂） | 创建型 | 未采用，分析其适用条件与当前设计的兼容性 | 当前直接组合具体类 |
| Builder（建造者） | 创建型 | 已实现，使用一个具体 Builder | `OrderBuilder` |
| Decorator（装饰器） | 结构型 | 已实现，组合多个订单验证规则 | `orderValidators.js` |
| Command（命令） | 行为型 | 已实现，同步执行下单请求 | `PlaceOrderCommand` |
| Observer（观察者） | 行为型 | 已实现，支持订阅、通知与退订 | `ObservableSubject` |
| State（状态） | 行为型 | 已实现，三个状态对象改变提交行为 | `OrderSubmission` 及三个具体状态类 |

创建型、结构型、行为型的术语采用 [GoF《Design Patterns》的分类](https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-software-9780201633610)。MVC 单独作为架构模式讨论。

下文的“已实现”以对象职责与实际调用关系为依据。JavaScript 中的接口可以由共同的方法约定表达，不要求额外创建一个空的抽象类。源码块均为项目现有代码的原样节选，局部方法或表达式应结合链接中的完整文件阅读。

## 2. MVC：模型、视图与控制器

### 2.1 目的与角色

MVC 将业务数据和规则、界面显示、用户操作的处理分开。这里采用适合 React 的轻量组织方式，重点是业务逻辑与显示职责的分离。[MVC 的职责划分参考 Martin Fowler 的 GUI Architectures](https://martinfowler.com/eaaDev/uiArchs.html)。

| 角色 | 项目对应 | 职责 |
|---|---|---|
| Model | `ShopStore`、`productModel`、`orderModel`、订单验证器与 `OrderBuilder` | 保存共享业务状态，计算统计与筛选，验证和处理订单 |
| View | `HomePage`、`ProductsPage`、`OrdersPage`、`SearchBar`、`TableProduct`、`RowProduct` | 渲染数据、表单、错误信息和低库存样式，将操作交给回调 |
| Controller | `useShopController`、`useOrderController` | 保存筛选与表单状态，接收事件，组织对 Model、Command 和 State 的调用 |
| 应用组装 | `App` | 连接路由、页面和 Controller 的返回值，通过 props 传递数据与回调 |

当前 `App` 的主要职责是组装。最初集中在 `App` 的协调行为，已经主要放进两个 Controller Hook；因此不宜把当前 `App` 单独称为 Model 或全部 Controller。

### 2.2 代码实例：商品筛选

`SearchBar` 读取输入值并调用回调：

源码：[components/searchbar/SearchBar.jsx:5](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/components/searchbar/SearchBar.jsx:5)，第 5–10 行。

```jsx
      <input
        id="name-filter"
        type="search"
        value={filters.name}
        onChange={(event) => onFilterChange('name', event.target.value)}
      />
```

`useShopController` 处理筛选条件的变化：

源码：[controller/useShopController.js:21](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/controller/useShopController.js:21)，第 21–23 行。

```js
  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }
```

同一个 Hook 调用 Model，再把结果交给 `App`：

源码：[controller/useShopController.js:27](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/controller/useShopController.js:27)，第 27–35 行。

```js
  return {
    products,
    orderCount: orders.length,
    filters,
    categoryStats: getCategoryStats(products),
    filteredProducts: filterProducts(products, filters),
    handleFilterChange,
    handlePlaceOrder,
  }
```

实际调用关系为：

1. `SearchBar` 触发 `onFilterChange('name', value)`。
2. `App` 已把这个回调绑定到 `handleFilterChange`。
3. Controller 更新 `filters`，触发新的渲染。
4. `productModel.filterProducts(products, filters)` 判断哪些商品符合条件。
5. `App` 把 `filteredProducts` 传给 `ProductsPage`，再传给 `TableProduct` 与 `RowProduct`。

因此，输入处理在 View，筛选状态在 Controller，筛选判定在 Model。

### 2.3 适用性、完整度与边界

这种划分让统计、筛选和订单规则可以脱离页面运行与测试。展示组件的拆分沿用了课堂示例中筛选栏、表格、商品行的组织思路。

这是轻量 MVC，而非逐类照搬传统 GUI 框架。`RowProduct` 会直接调用 Model 的只读查询 `isLowStock(product)`，再选择 CSS 类；低库存规则仍定义在 Model。订单的错误原因由 Model 返回，法语提示文案由 View 中的 `getOrderErrorMessage` 决定。

React 本身不会自动完成 MVC；这里的职责边界来自项目的模块划分和调用方式。

## 3. Singleton：共享商店实例

### 3.1 目的与角色

Singleton 控制实例的创建，并提供统一的访问入口。本项目用一个 `ShopStore` 共享商品与订单，避免页面各自保存一份库存。

| 角色 | 项目对应 |
|---|---|
| 单例类 | `ShopStore` |
| 唯一实例引用 | 静态私有字段 `#instance` |
| 访问入口 | `ShopStore.getInstance()` |
| 构造限制 | 模块内的 `constructorKey` 与构造函数检查 |
| 使用者 | `useShopController` 模块中的 `shopStore` |

### 3.2 代码实例

实例按需创建，并在后续调用中复用：

源码：[model/ShopStore.js:21](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/model/ShopStore.js:21)，第 21–26 行。

```js
  static getInstance() {
    if (!ShopStore.#instance) {
      ShopStore.#instance = new ShopStore(constructorKey)
    }
    return ShopStore.#instance
  }
```

构造入口还受到模块私有凭据的限制：

源码：[model/ShopStore.js:5](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/model/ShopStore.js:5)，第 5–14 行。

```js
const constructorKey = Symbol('ShopStore')

export class ShopStore {
  static #instance
  #subject

  constructor(key) {
    if (key !== constructorKey) {
      throw new Error('Use ShopStore.getInstance().')
    }
```

`constructorKey` 没有导出，外部直接调用 `new ShopStore()` 会抛出错误。`useShopController` 通过 `getInstance()` 获得商店，再订阅它的快照。

### 3.3 适用性、完整度与边界

该实现同时具备统一入口、实例缓存和构造限制，符合当前应用的单例用途。单例位于 Model 层，三个页面不会因为分别渲染而创建多套库存。

唯一性限于当前 JavaScript 模块实例。浏览器标签页之间不共享这个对象，整页刷新会重新创建它。它不提供数据库或持久化能力，也不会写回 `products.json`。

全局访问也使依赖更集中。项目通过向 `PlaceOrderCommand` 显式传入接收者，让命令仍可使用替代接收者单独测试。

## 4. Abstract Factory：未采用的抽象工厂

### 4.1 目的与标准角色

Abstract Factory 通过共同的创建接口，生成一组彼此配套的对象。通常涉及抽象工厂、具体工厂、抽象产品、具体产品及使用者。[定义与参与者参考 GoF 原著的 Abstract Factory 公开节选](https://www.informit.com/articles/article.aspx?p=1398599)。

这里的“产品”指工厂创建的软件对象，不是商品数据里的水果或蔬菜。

### 4.2 当前代码实例与判断

当前订单验证器直接由具体类组合：

源码：[model/orderModel.js:9](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/model/orderModel.js:9)，第 9–12 行。

```js
const itemsValidator = new StockValidationDecorator(
  new UniqueProductsDecorator(new OrderItemsValidator()),
)
const orderValidator = new CustomerValidationDecorator(itemsValidator)
```

调用者明确知道 `StockValidationDecorator`、`UniqueProductsDecorator` 和 `OrderItemsValidator`。代码没有通过统一的工厂接口切换一组配套对象，也没有相关的多套对象族。因此，该段代码体现的是具体对象的创建和 Decorator 组合。

`new OrderBuilder()` 负责逐步组装一张订单；`ShopStore.getInstance()` 负责取得单例。两者都没有承担“创建一组相关产品对象”的职责。

### 4.3 适用性与架构兼容性

当前只有一套商品结构、订单结构与验证规则，没有需要成套替换的对象族。仅因存在四个商品类别就建立多个工厂，不能带来这里所需的对象族切换能力。

JavaScript 和 React 不阻止使用 Abstract Factory。若以后确实需要成套替换相关领域对象，可以在 Model 的创建边界引入工厂，并让业务调用者依赖共同接口；View 仍可保留现有 props 契约。

这是条件分析，当前代码尚未采用该模式。现阶段直接组合具体类更贴合应用规模，也避免增加无实际使用场景的抽象。

## 5. Builder：分步骤构建订单

### 5.1 目的与角色

Builder 将对象的构建过程拆成明确步骤。本项目需要先收集客户信息，再加入一条或多条订单行，最后生成订单对象。

| 角色 | 项目对应 |
|---|---|
| 具体 Builder | `OrderBuilder` |
| 构建步骤 | `withCustomer()`、`addItem()` |
| 获取构建结果 | `build()` |
| Product | 包含姓、名、邮箱与 `items` 的普通订单对象 |
| 组织构建步骤的角色 | `orderModel.placeOrder()` 函数承担 Director 的工作 |

### 5.2 代码实例

源码：[model/OrderBuilder.js:1](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/model/OrderBuilder.js:1)，第 1–28 行。

```js
export class OrderBuilder {
  #customer = null
  #items = []

  withCustomer({ lastName, firstName, email }) {
    this.#customer = {
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      email: email.trim(),
    }
    return this
  }

  addItem({ productId, quantity }) {
    this.#items.push({ productId, quantity })
    return this
  }

  build() {
    if (!this.#customer || this.#items.length === 0) {
      throw new Error('Cannot build an incomplete order.')
    }
    return {
      ...this.#customer,
      items: this.#items.map((item) => ({ ...item })),
    }
  }
}
```

`withCustomer()` 和 `addItem()` 返回 `this`，因此可以链式调用。前者去除客户字段两侧的空白；后者保存商品标识与数量。`build()` 检查必要结构，并复制订单行后返回结果。

实际业务调用先通过验证，再构建订单并计算扣减后的库存：

源码：[model/orderModel.js:35](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/model/orderModel.js:35)，第 35–48 行。

```js
export function placeOrder(products, draft) {
  const validation = orderValidator.validate(products, draft)
  if (!validation.valid) return validation

  const builder = new OrderBuilder().withCustomer(draft)
  for (const item of draft.items) {
    builder.addItem(item)
  }
  const order = builder.build()
  return {
    valid: true,
    products: applyStockDeduction(products, order.items),
    order,
  }
```

### 5.3 适用性、完整度与边界

该实现把“如何逐步组装订单”从“何时允许下单”中分离出来。构建结果中的订单行不复用 Builder 内部的行对象；以后继续调用 `addItem()` 不会改变先前返回的订单。

项目使用一个具体 Builder，Director 的职责由函数承担。没有额外的抽象 Builder 类，也没有多种订单表示；这是当前需求下的轻量实现。

`build()` 只检查客户信息是否已设置、是否至少有一条订单行。邮箱格式、重复商品、合法数量与库存限制由验证器负责；单独调用 Builder 不代表已经完成全部业务验证。

## 6. Decorator：可组合的订单验证

### 6.1 目的与角色

Decorator 保存一个具有相同接口的对象，并通过委托调用，在原有行为前后增加规则。本项目共同的方法约定是 `validate(products, draft)`。

| 角色 | 项目对应 | 职责 |
|---|---|---|
| Component 接口约定 | `validate(products, draft)` | 返回包含 `valid` 的验证结果 |
| Concrete Component | `OrderItemsValidator` | 检查非空订单、正整数数量和商品是否存在 |
| 基础 Decorator | `OrderValidatorDecorator` | 保存并调用被包装的验证器 |
| Concrete Decorator | `UniqueProductsDecorator` | 拒绝重复选择同一商品 |
| Concrete Decorator | `StockValidationDecorator` | 拒绝超出当前库存的数量 |
| Concrete Decorator | `CustomerValidationDecorator` | 验证姓名与邮箱 |

### 6.2 代码实例

基础装饰器通过组合保存验证器，并保持同一个方法签名：

源码：[model/orderValidators.js:19](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/model/orderValidators.js:19)，第 19–29 行。

```js
export class OrderValidatorDecorator {
  #validator

  constructor(validator) {
    this.#validator = validator
  }

  validate(products, draft) {
    return this.#validator.validate(products, draft)
  }
}
```

库存装饰器先执行已有验证，再增加库存规则：

源码：[model/orderValidators.js:47](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/model/orderValidators.js:47)，第 47–65 行。

```js
export class StockValidationDecorator extends OrderValidatorDecorator {
  validate(products, draft) {
    const validation = super.validate(products, draft)
    if (!validation.valid) return validation

    for (const item of draft.items) {
      const product = products.find(({ id }) => id === item.productId)
      if (item.quantity > product.quantity) {
        return {
          valid: false,
          reason: 'insufficient-stock',
          productId: product.id,
          available: product.quantity,
        }
      }
    }
    return validation
  }
}
```

完整的包装结构由第 4 节所示的实际创建代码组成：

`CustomerValidationDecorator(StockValidationDecorator(UniqueProductsDecorator(OrderItemsValidator)))`

实际判定顺序是：

1. `CustomerValidationDecorator` 先检查客户姓名和邮箱。
2. 验证调用向内委托，`OrderItemsValidator` 检查订单行的基础合法性。
3. 调用返回到 `UniqueProductsDecorator`，检查重复商品。
4. 再返回到 `StockValidationDecorator`，检查库存。

遇到失败即返回首个失败结果。

### 6.3 适用性、完整度与边界

共同接口、被包装对象、委托调用和规则叠加均在代码中存在，因此这里具备 Decorator 的主要结构。新增独立规则可以增加一个包装层，业务入口仍调用 `validate()`。

这些规则有顺序依赖：库存规则在查找商品后直接读取 `product.quantity`，因此依赖基础验证器先确认商品存在。当前组合满足这个前提，不能认为所有包装顺序都可以随意交换。

这套机制位于 Model，保护实际下单入口。页面中的 `required`、`min`、`max` 和禁用重复选项提供即时交互反馈，最终仍需经过同一套 Model 验证。CSS 低库存样式不属于这里的 Decorator 模式。

## 7. Command：将下单请求封装成对象

### 7.1 目的与角色

Command 将执行目标和请求参数放进一个对象，通过统一的执行方法触发动作。

| 角色 | 项目对应 |
|---|---|
| Command 接口约定 | `execute()` |
| Concrete Command | `PlaceOrderCommand` |
| Client | `useShopController` 中创建命令的代码 |
| Invoker | `handlePlaceOrder` 中调用 `execute()` 的代码 |
| Receiver | 传入命令的 `ShopStore` 实例 |
| 请求内容 | 私有字段 `#draft` |

### 7.2 代码实例

源码：[controller/PlaceOrderCommand.js:1](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/controller/PlaceOrderCommand.js:1)，第 1–13 行。

```js
export class PlaceOrderCommand {
  #receiver
  #draft

  constructor(receiver, draft) {
    this.#receiver = receiver
    this.#draft = structuredClone(draft)
  }

  execute() {
    return this.#receiver.placeOrder(this.#draft)
  }
}
```

Controller 实际创建并执行命令：

源码：[controller/useShopController.js:25](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/controller/useShopController.js:25)，第 25 行。

```js
  const handlePlaceOrder = (draft) => new PlaceOrderCommand(shopStore, draft).execute()
```

Client 与 Invoker 的职责在当前实现中集中于同一个回调。`execute()` 委托接收者的 `placeOrder()`，并将结果原样返回给提交状态对象。

### 7.3 适用性、完整度与边界

命令对象拥有接收者和请求数据，符合请求对象化的结构。`structuredClone(draft)` 捕获创建时的草稿；外部随后修改原草稿，不会改变这条命令保存的请求。

当前只有一种同步命令，没有额外的抽象 Command 类、队列、历史或撤销功能。它们不是本项目实际提供的能力。

命令本身也没有“只执行一次”的限制。防止同一已成功提交再次执行，由后面的 State 机制负责；Command 不能单独提供去重或事务保证。

## 8. Observer：让 React 接收状态变化

### 8.1 目的与角色

Observer 允许使用者订阅对象的变化。状态更新时，被观察者通知订阅者，使数据源无需直接调用具体页面。

| 角色 | 项目对应 |
|---|---|
| Subject | `ObservableSubject` |
| 被观察的快照 | 商品与订单快照；订单提交状态快照 |
| Observer | `subscribe(observer)` 注册的回调函数 |
| 订阅与退订 | `subscribe()` 及其返回的清理函数 |
| React 接入 | `useSyncExternalStore(subscribe, getSnapshot)` |

### 8.2 代码实例

源码：[model/ObservableSubject.js:1](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/model/ObservableSubject.js:1)，第 1–23 行。

```js
export class ObservableSubject {
  #snapshot
  #observers = new Set()

  constructor(snapshot) {
    this.#snapshot = snapshot
  }

  getSnapshot = () => this.#snapshot

  subscribe = (observer) => {
    this.#observers.add(observer)
    return () => this.#observers.delete(observer)
  }

  update(snapshot) {
    if (Object.is(this.#snapshot, snapshot)) return
    this.#snapshot = snapshot
    for (const observer of [...this.#observers]) {
      observer()
    }
  }
}
```

`useShopController` 将商店接入 React：

源码：[controller/useShopController.js:9](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/controller/useShopController.js:9)，第 9 行。

```js
  const { products, orders } = useSyncExternalStore(shopStore.subscribe, shopStore.getSnapshot)
```

`ShopStore` 和 `OrderSubmission` 各自持有一个 `ObservableSubject`，分别通知业务数据变化和表单提交状态变化。

React 的 `useSyncExternalStore` 通过订阅函数和快照函数接入外部状态；订阅函数返回退订函数，快照在没有变化时需要保持稳定。[接口要求见 React 官方文档](https://react.dev/reference/react/useSyncExternalStore)。

### 8.3 实际通知过程

1. 下单成功后，`ShopStore` 一次更新包含新商品库存和新订单列表的快照。
2. `ObservableSubject.update()` 保存快照，再同步调用已注册的回调。
3. React 通过 `useSyncExternalStore` 读取快照，并触发相关组件更新。
4. `useShopController` 重新计算类别统计和筛选结果，`App` 将新值传给页面。
5. 之后切换到另一个页面，该页面也从同一个 Controller 获得最新数据。

当前是 `App` 调用的 `useShopController` 订阅商店；三个页面通过 props 接收结果，并非每个页面都直接注册一个 Observer。

### 8.4 适用性、完整度与边界

订阅、保存订阅者、通知和退订均已实现。`Set` 避免同一个回调重复登记；`Object.is` 跳过相同快照引用的更新；`getSnapshot()` 返回保存的引用。

该机制要求调用者用新快照表达变化。若绕过接口直接修改快照内部对象，就不会自动触发通知。当前商店成功下单时创建新快照，失败时保留原快照。

通知是同步函数调用。观察者模式在这里负责页面数据同步，不提供跨标签页广播或后端推送。

## 9. State：订单提交状态改变行为

### 9.1 目的与角色

State 将不同状态下的行为交给不同对象。Context 保留当前状态，并将操作委托给它。

| 角色 | 项目对应 | 行为 |
|---|---|---|
| Context | `OrderSubmission` | 保存当前状态，委托 `edit()` 和 `submit()`，发布快照 |
| State 基础类 | `OrderSubmissionState` | 提供编辑与提交的默认处理 |
| Concrete State | `EditingOrderState` | 初始编辑状态，反馈为空；再次编辑不切换状态 |
| Concrete State | `RejectedOrderState` | 保存失败结果，允许修改或重试 |
| Concrete State | `AcceptedOrderState` | 保存成功结果，重复提交返回已有结果 |
| 使用者 | `useOrderController` | 输入变化时调用 `edit()`，表单提交时调用 `submit()` |

### 9.2 代码实例

基础状态定义默认行为：编辑时进入编辑状态，提交后根据结果切换状态。

源码：[controller/OrderSubmission.js:3](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/controller/OrderSubmission.js:3)，第 3–15 行。

```js
class OrderSubmissionState {
  edit(context) {
    context.transitionTo(new EditingOrderState())
  }

  submit(context, draft, execute) {
    const result = execute(draft)
    context.transitionTo(result.valid
      ? new AcceptedOrderState(result)
      : new RejectedOrderState(result))
    return result
  }
}
```

Context 将提交委托给当前状态：

源码：[controller/OrderSubmission.js:72](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/controller/OrderSubmission.js:72)，第 72–74 行。

```js
  submit(draft, execute) {
    return this.#state.submit(this, draft, execute)
  }
```

成功状态覆盖提交行为：

源码：[controller/OrderSubmission.js:38](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/src/controller/OrderSubmission.js:38)，第 38–53 行。

```js
class AcceptedOrderState extends OrderSubmissionState {
  #result

  constructor(result) {
    super()
    this.#result = result
  }

  submit() {
    return this.#result
  }

  getSnapshot() {
    return { status: 'accepted', result: this.#result }
  }
}
```

这里的行为差异是实际发生的：编辑和失败状态会执行传入的 `execute(draft)`；成功状态的 `submit()` 直接返回已保存结果，不再次执行下单。

### 9.3 状态转换

| 当前状态 | 操作 | 结果 |
|---|---|---|
| `editing` | 编辑字段或订单行 | 保持 `editing` |
| `editing` | 提交 | 执行下单，按结果进入 `accepted` 或 `rejected` |
| `rejected` | 编辑字段或订单行 | 进入 `editing`，清除失败反馈 |
| `rejected` | 再次提交 | 重新执行下单，按结果切换状态 |
| `accepted` | 重复提交 | 保持 `accepted`，返回原结果，不执行新下单 |
| `accepted` | 编辑字段或订单行 | 进入 `editing`，允许准备下一张订单 |

### 9.4 适用性、完整度与边界

Context、共同操作、三个具体状态和委托调用均存在。判断依据是状态对象改变了 `submit()` 的行为；界面使用的 `status` 字符串只是这些对象提供的快照信息。

`useOrderController` 中的 React `useState` 保存这个 Context 实例；单独使用 React `useState` 并不自动等于采用 State 模式。

提交成功后，Controller 会清空表单字段，但状态仍保持 `accepted`。用户下一次修改字段或订单行时才触发 `edit()`。离开订单页后，这个页面的 Controller 会卸载；再次进入会创建新的提交状态，但共享 `ShopStore` 仍保留。

当前实现处理编辑、失败与成功三种同步提交状态，没有异步加载、支付或配送状态。

## 10. 模式如何协作完成一次下单

实际调用顺序如下：

1. **MVC／View**：`OrdersPage` 的表单把提交事件交给 `handleSubmit`。
2. **MVC／Controller**：`useOrderController` 阻止默认提交，将数量转为 `Number`，并组装草稿。
3. **State**：`OrderSubmission.submit(draft, onPlaceOrder)` 将操作交给当前状态。允许提交的状态调用 `onPlaceOrder(draft)`。
4. **Command**：`App` 绑定的 `onPlaceOrder` 实际是 `handlePlaceOrder`；它创建并执行 `PlaceOrderCommand`。
5. **Singleton／Model**：命令调用共享 `ShopStore.placeOrder()`。商店读取当前库存，再调用 `orderModel.placeOrder()`。
6. **Decorator**：完整验证器检查客户、订单行、重复商品和库存。失败时立即返回结果，商店不更新库存与订单。
7. **Builder**：验证成功后，`OrderBuilder` 构建订单，Model 计算扣减后的商品列表并返回成功结果。
8. **Observer**：商店一次发布包含商品和订单的新快照，React 重新读取并更新统计与显示。
9. **State＋Observer**：下单结果返回到提交状态，Context 切换为成功或失败状态，并通过自己的 Subject 通知订单页面显示反馈。

这里的 `onPlaceOrder` 是传入的函数引用；状态类里的 `execute` 参数接收同一个函数。它们是不同位置的参数命名，并非多个先后执行的下单动作。

### 10.1 初始数据下的具体结果

从初始状态开始，Fruit 有 5 种商品，总库存 40，平均库存 8，订单数为 0。下表描述将草稿交给 `ShopStore.placeOrder()` 后的业务结果；正常表单还会先受到 `max` 等 HTML 输入限制。

| 操作 | 处理结果 | 共享状态与统计 |
|---|---|---|
| 下单 2 件 Pomme、1 件 Banane，客户信息合法 | Pomme 库存从 12 变为 10，Banane 从 3 变为 2，Fruit 总库存变为 37 | Fruit 商品数仍为 5，平均库存为 7.4，订单数为 1 |
| 随后通过同一业务入口请求 4 件 Banane | 返回 `insufficient-stock`，保留已有库存和订单 | Fruit 平均库存仍为 7.4，订单数仍为 1 |

库存扣减与 Fruit 平均库存 7.4 的示例，以及单例、Builder、Decorator、Command、Observer 和 State 的行为，都有现有测试用例支持：[shop.test.js](D:/CZY/Learn/MIAGE-M2-IPM/developpement-front/demo/mini-project/app/tests/shop.test.js)。

## 11. 综合分析

MVC 决定职责放在哪里；其他已采用的模式解决这些职责内部的具体问题：

- Model 使用 Singleton 提供共享状态，使用 Decorator 验证规则，使用 Builder 构建订单。
- Controller 使用 Command 表达下单动作，使用 State 管理本次提交的行为。
- Observer 将 Model 与提交状态的变化接入 React 渲染。

七种已采用模式的角色及调用关系都可在当前代码中定位。其中 MVC、Builder 和 Command 保持了适合项目规模的简化形式。Abstract Factory 与当前技术栈兼容，但当前没有需要成套创建并切换的对象族，因此保留为适用性分析。
