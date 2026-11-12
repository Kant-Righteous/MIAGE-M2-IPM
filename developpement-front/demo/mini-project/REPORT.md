# Mini Projet：Site commercial（React）

## 第一部分：组件图

图中的 "Use Shop Behavior" 和 "Use Order Behavior" 分别对应代码里的 `useShopController` 和 `useOrderController`。连线上的简写 `update`、`add`、`remove`、`submit` 对应 `updateCustomer` / `updateItem`、`addItem`、`removeItem` 和 `handleSubmit`；`enabled` 对应 `disabled` 属性（含义相反）。

### 图 1：应用总体

![图 1：应用总体组件图](diagrams/report-01-overview.jpg)

`App` 里调用一次 `useShopController`，再把结果通过 props 传给三个页面。React Router 按路径（`/`、`/products`、`/orders`）决定显示哪个页面。三个页面用的是同一份数据，所以在订单页下单后，首页的订单数和商品页的库存都会跟着变。

### 图 2：商品页

![图 2：商品页组件图](diagrams/report-02-products.jpg)

SearchBar 有 7 个输入框和 1 个下拉框，可以按所有属性筛选，修改时通过 `onFilterChange(field, value)` 通知 Hook。TableProduct 接收筛选后的商品。

### 图 3：订单页

![图 3：订单页组件图](diagrams/report-03-orders.jpg)

订单页拆成单个控件来画。数量输入框的 `min = 1` 是写死的常量，所以只画了属性、没有连线；`max` 来自所选商品的库存，所以要从 Hook 取值，这就是"不能超过可用数量"这个要求的实现。

## 第二部分：设计模式分析

| 模式 | 情况 | 是否完整 | 位置 |
|---|---|---|---|
| MVC | 存在 | 完整 | `model/`、`controller/`、`pages/`、`components/` 和 `App.jsx` |
| Singleton | 存在 | 完整 | `model/ShopStore.js` |
| Abstract Factory | 兼容，没有实现 | — | — |
| Builder | 存在 | 不完整 | `model/OrderBuilder.js`、`model/orderModel.js` |
| Decorator | 存在 | 完整 | `model/orderValidators.js`、`model/orderModel.js` |
| Command | 存在 | 不完整 | `controller/PlaceOrderCommand.js`、`controller/useShopController.js` |
| Observer | 存在 | 完整 | `model/ObservableSubject.js`（`ShopStore` 和 `OrderSubmission` 使用） |
| State | 存在 | 完整 | `controller/OrderSubmission.js`、`controller/useOrderController.js` |

### MVC

- Model：`ShopStore`、`productModel`、`orderModel`（以及它们内部用到的 `OrderBuilder`、`orderValidators`、`ObservableSubject` 和数据文件 `products.json`）；
- View：页面和展示组件，`App` 负责组装路由和页面；
- Controller：两个 Hook，负责保存筛选条件和表单内容，并调用 Model（`controller/` 里的 `PlaceOrderCommand` 和 `OrderSubmission` 由它们调用，见 Command 和 State）。

举个例子：在 SearchBar 里输入 → `handleFilterChange` 更新 `filters` → `filterProducts(products, filters)` 算出结果 → 表格重新渲染。

不完全"标准"的地方有两处：`RowProduct` 直接 import 了 Model 里的 `isLowStock`；错误文案 `getOrderErrorMessage` 写在 `OrdersPage` 里。严格来说这两处都应该放进 Controller。

### Singleton

整个应用只有一个 `ShopStore`，三个页面因此看到同一份库存。构造函数需要一个模块内部的 key，外面直接 `new ShopStore()` 会报错，只能通过 `getInstance()` 获取：

```js
static getInstance() {
  if (!ShopStore.#instance) {
    ShopStore.#instance = new ShopStore(constructorKey)
  }
  return ShopStore.#instance
}
```

### Abstract Factory（兼容，没有实现）

项目里只有一种订单，所以没有"成套的对象"需要切换。如果以后要区分个人订单和企业订单，每种订单都有自己的验证器和 Builder，就可以加一个 `OrderFactory`（`createValidator()`、`createBuilder()`），再分别实现 `PersonalOrderFactory` 和 `BusinessOrderFactory`。现阶段加进来只会多出几个类，所以我们没有做。

### Builder

`placeOrder` 先用 `withCustomer()` 写入客户信息，再用 `addItem()` 逐行加入商品，最后 `build()` 检查订单是否完整。之所以算简化版，是因为没有抽象的 Builder 接口，Director 的角色也由 `placeOrder` 函数兼任。老实说，在这个项目里 Builder 的作用不大，订单的结构本来就很简单。

### Decorator

`OrderItemsValidator` 做最基本的检查，另外三条规则都是装饰器，接口都是 `validate(products, draft)`，按需要一层层包起来：

```js
const itemsValidator = new StockValidationDecorator(
  new UniqueProductsDecorator(new OrderItemsValidator()),
)
const orderValidator = new CustomerValidationDecorator(itemsValidator)
```

检查顺序是：客户信息 → 订单行基本检查 → 重复商品 → 库存，遇到第一个错误就返回。以后要加新规则，只需要再包一层。

### Command

下单动作被封装成 `PlaceOrderCommand`，`execute()` 再交给 `ShopStore.placeOrder()` 执行：

```js
const handlePlaceOrder = (draft) => new PlaceOrderCommand(shopStore, draft).execute()
```

不完整的地方在于：命令创建后马上执行，没有单独的 Invoker，也没有保存历史，所以不能撤销。要补全的话，可以加一个 `undo()` 把库存加回去，再在 Controller 里用一个列表保存已经执行过的命令。

### Observer

`ObservableSubject` 提供 `subscribe()`、退订和 `update()` 三个功能。数据变化时，`update()` 会通知所有订阅者。React 端用 `useSyncExternalStore(shopStore.subscribe, shopStore.getSnapshot)` 订阅，下单成功后页面就会自动刷新。`OrderSubmission` 也用同一个类来通知订单页提交状态的变化。

### State

订单提交有三个状态：编辑中、失败、成功。同一个 `submit()`，在不同状态下行为不一样：编辑中和失败状态会真正下单，成功状态只返回上一次的结果，不会重复下单：

```js
class AcceptedOrderState extends OrderSubmissionState {
  // ...
  submit() {
    return this.#result
  }
}
```

只要修改了任意字段，就会调用 `edit()` 回到编辑状态，错误提示也随之消失。

### 一次下单时这些模式怎么配合

1. 点击 Valider la commande 时，`useOrderController` 整理出订单草稿（State：`submit`）。
2. 调用 `handlePlaceOrder`，创建并执行 `PlaceOrderCommand`（Command）。
3. 命令调用唯一的 `ShopStore`（Singleton），再由它调用 `orderModel.placeOrder()`。
4. 验证器链依次检查订单（Decorator），通过后用 `OrderBuilder` 生成订单（Builder）。
5. `ShopStore` 发布新的库存和订单，各页面随之更新（Observer）。
6. 结果返回给 `OrderSubmission`，订单页显示成功或错误提示（State + Observer）。

## 其他说明

- 数据只保存在内存里，刷新页面后会回到 `products.json` 的初始数据。我们中途做过一版用 localStorage 保存库存、加"还原库存"按钮的功能，最后没有保留。
- 首页只显示订单数量，没有订单列表页面；作业只要求显示数量。
