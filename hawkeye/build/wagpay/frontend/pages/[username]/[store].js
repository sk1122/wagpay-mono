"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const Product_1 = __importDefault(require("../../components/Product"));
const PaymentCard_1 = __importDefault(require("../../components/PaymentCard"));
const react_1 = require("react");
const react_2 = require("react");
const router_1 = require("next/router");
const getServerSideProps = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`https://wagpay.xyz/api/pages/${context.params.store}?username=${context.params.username}`);
        console.log(`https://wagpay.xyz/api/pages/${context.params.store}?username=${context.params.username}`);
        const store = yield res.json();
        return {
            props: {
                store: store,
            },
        };
    }
    catch (e) {
        return {
            redirect: {
                permanent: false,
                destination: `/claim?username=${context.params.store}`,
            },
        };
    }
});
exports.getServerSideProps = getServerSideProps;
const Store = ({ store }) => {
    const { query } = (0, router_1.useRouter)();
    const updateVisit = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(store.id);
        let data = yield fetch(`https://wagpay.xyz/api/pages/updateVisits?id=${store.id}`, {
            method: 'PATCH',
        });
    });
    (0, react_2.useEffect)(() => {
        updateVisit();
    }, []);
    (0, react_2.useEffect)(() => {
        if (query.products) {
            const products = query.products;
            (() => __awaiter(void 0, void 0, void 0, function* () {
                let ids = [];
                const promise = yield products.map((v) => __awaiter(void 0, void 0, void 0, function* () {
                    let data = yield fetch(`https://wagpay.xyz/api/products/${v}`);
                    let product = (yield data.json());
                    console.log(product);
                    ids.push(product);
                }));
                yield Promise.all(promise);
                addNewProduct(ids);
            }))();
        }
    }, []);
    (0, react_2.useEffect)(() => {
        if (query && query.price) {
            setTotalPrice(Number(query.price));
            setSelectProducts(true);
        }
    }, []);
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [qrCode, setQrCode] = (0, react_1.useState)('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png');
    const [selectedProducts, setSelectedProducts] = (0, react_1.useState)([]);
    const [totalPrice, setTotalPrice] = (0, react_1.useState)(0);
    const [selectProducts, setSelectProducts] = (0, react_1.useState)(false);
    const [url, setUrl] = (0, react_1.useState)('https://qr-code-styling.com');
    (0, react_2.useEffect)(() => console.log(qrCode), [qrCode]);
    const addNewProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
        let unique = [...selectedProducts, ...productId];
        let totalValue = 0;
        const promise = yield unique.map((value) => (totalValue += value.discounted_price));
        yield Promise.all(promise);
        setTotalPrice(totalValue);
        setSelectedProducts(unique);
    });
    (0, react_2.useEffect)(() => console.log(selectedProducts), [selectedProducts]);
    const removeProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
        let unique = selectedProducts;
        for (let i = 0; i < unique.length; i++) {
            if (unique[i].id === productId[0].id) {
                unique.splice(i, 1);
                break;
            }
        }
        console.log(unique);
        let totalValue = 0;
        const promise = yield unique.map((value) => (totalValue += value.discounted_price));
        yield Promise.all(promise);
        setTotalPrice(totalValue);
        setSelectedProducts(unique);
    });
    const createTransaction = (email, fields, eth, sol) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = {
            email: email,
            fields: fields,
            eth_address: eth,
            sol_address: sol,
            page_id: store.id,
            products: selectedProducts.map((value) => value.id),
        };
        const data = yield fetch('/api/submissions/create', {
            method: 'POST',
            body: JSON.stringify(transaction),
        });
        const res = yield data.json();
        return res.id;
    });
    const updateTransaction = (transactionId, successful, transactionHash) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = {
            id: transactionId,
            transaction_hash: transactionHash,
        };
        console.log(transaction);
        const data = yield fetch('/api/submissions/update', {
            method: 'POST',
            body: JSON.stringify(transaction),
        });
        const res = yield data.json();
        console.log(res);
    });
    const [options, setOptions] = (0, react_1.useState)({
        width: 300,
        height: 300,
        type: 'svg',
        data: '',
        image: '/spay.svg',
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'Q',
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.3,
            margin: 10,
            crossOrigin: 'anonymous',
        },
        dotsOptions: {
            color: '#222222',
            // gradient: {
            //   type: 'linear', // 'radial'
            //   rotation: 0,
            //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
            // },
            type: 'rounded',
        },
        backgroundOptions: {
            color: '#fff',
            // gradient: {
            //   type: 'linear', // 'radial'
            //   rotation: 0,
            //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
            // },
        },
        cornersSquareOptions: {
            color: '#222222',
            type: 'extra-rounded',
            // gradient: {
            //   type: 'linear', // 'radial'
            //   rotation: 180,
            //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
            // },
        },
        cornersDotOptions: {
            color: '#222222',
            type: 'dot',
            // gradient: {
            //   type: 'linear', // 'radial'
            //   rotation: 180,
            //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
            // },
        },
    });
    const [qrCodes, setQrCodes] = (0, react_1.useState)();
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(() => {
        if (typeof window !== 'undefined') {
            const QRCodeStyling = require('qr-code-styling');
            setQrCodes(new QRCodeStyling(options));
        }
    }, []);
    (0, react_2.useEffect)(() => {
        if (!qrCodes)
            return;
        if (ref.current) {
            qrCodes.append(ref.current);
        }
    }, [qrCodes, ref]);
    (0, react_2.useEffect)(() => {
        if (!qrCodes)
            return;
        qrCodes.update(options);
    }, [qrCodes, options]);
    const onDataChange = (url) => {
        if (!qrCodes)
            return;
        setOptions((options) => (Object.assign(Object.assign({}, options), { data: url })));
    };
    (0, react_2.useEffect)(() => {
        console.log(isModalOpen);
        console.log(url);
        onDataChange(url);
    }, [url]);
    return (<div className="w-full min-h-screen bg-gray-900 font-inter">
      <div className={(isModalOpen ? "" : "hidden") + "w-full h-full backdrop-blur-sm absolute z-50"} onClick={() => setIsModalOpen(false)}>
        <div className={(isModalOpen ? "" : "hidden") + " absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-transparent w-64 h-64"}>
				  <p className='text-white'>Scan this code to pay with any solana mobile wallet</p>
          <div ref={ref}></div>
				</div>
			</div>
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-center items-start flex-col space-y-3">
          <h1 className="text-white font-jakarta text-3xl font-extrabold tracking-tight sm:text-4xl">
            {store.title}
          </h1>
          <p className='text-white'>{store.description}</p>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {store && store.products.map((product, productIdx) => (<Product_1.default selectProducts={selectProducts} product={product} add={addNewProduct} remove={removeProduct} productIds={query.products}/>))}
            </ul>
          </section>

          {/* Payment Card */}
          <section aria-labelledby="payment-card" className="mt-16 rounded-lg  lg:col-span-5 lg:mt-0">
            <PaymentCard_1.default accepted_currencies={store.accepted_currencies} setURL={setUrl} updateTransaction={updateTransaction} createTransaction={createTransaction} storeId={store.id} fields={store.fields} totalPrice={totalPrice} merchantETH={store.eth_address} merchantSOL={store.sol_address} setIsModalOpen={setIsModalOpen} setQrCode={setQrCode}/>
          </section>
        </div>
      </main>
    </div>);
};
exports.default = Store;
