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
const react_1 = require("react");
const solid_1 = require("@heroicons/react/solid");
const supabase_1 = require("../../supabase");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const StoreSuccess_1 = __importDefault(require("./StoreSuccess"));
const create_1 = require("../../pages/api/pages/create");
const supported_currencies = ['SOL', 'ETH'];
const NewStore = (props) => {
    const [products, setProducts] = (0, react_1.useState)([]);
    const [fields, setFields] = (0, react_1.useState)([]);
    const [storeSuccess, setStoreSuccess] = (0, react_1.useState)(false);
    const [tweet, setTweet] = (0, react_1.useState)('');
    const [title, setTitle] = (0, react_1.useState)('');
    const [logo, setLogo] = (0, react_1.useState)();
    const [description, setDescription] = (0, react_1.useState)('');
    const [socialLinks, setSocialLinks] = (0, react_1.useState)({});
    const [currencies, setCurrencies] = (0, react_1.useState)([]);
    const [slug, setSlug] = (0, react_1.useState)('');
    const [eth, setETH] = (0, react_1.useState)('');
    const [sol, setSOL] = (0, react_1.useState)('');
    const changeField = (field, value, idx) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(field, value, idx, fields.length);
        yield setFields((previousState) => {
            let field_values = [...fields];
            console.log(field_values, fields.length);
            field_values[idx][field] = value;
            console.log(field_values, fields.length);
            return field_values;
        });
    });
    const changeProduct = (field, value, idx) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(field, value, idx);
        if (field === 'discounted_price') {
            setProducts((prevState) => {
                let product_values = [...products];
                product_values[idx].discounted_price = value;
                return product_values;
            });
        }
        else if (field === 'price') {
            setProducts((prevState) => {
                let product_values = [...products];
                product_values[idx].price = value;
                return product_values;
            });
        }
        else if (field === 'description') {
            setProducts((prevState) => {
                let product_values = [...products];
                product_values[idx].description = value;
                return product_values;
            });
        }
        else if (field === 'name') {
            console.log('1');
            setProducts((prevState) => {
                let product_values = [...products];
                product_values[idx].name = value;
                return product_values;
            });
        }
        else if (field === 'links') {
            setProducts((prevState) => {
                let product_values = [...products];
                product_values[idx].links = String(value).split(',');
                return product_values;
            });
        }
        else if (field === 'image') {
            setProducts((prevState) => {
                let product_values = [...products];
                product_values[idx].image = value[0];
                return product_values;
            });
        }
    });
    // @ts-ignore
    const handleImage = (file, setImg) => {
        console.log(file[0], "FILE");
        setImg(file[0]);
    };
    const submit = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (typeof products === 'undefined' || products.length <= 0) {
            console.log('dsa');
            react_hot_toast_1.default.error('Add Products');
            return;
        }
        if (typeof fields === 'undefined' || fields.length <= 0) {
            react_hot_toast_1.default.error('Add Fields');
            return;
        }
        const toastId = react_hot_toast_1.default.loading('Creating Store');
        try {
            var data = yield fetch('/api/pages/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    logo: logo,
                    description: description,
                    social_links: socialLinks,
                    accepted_currencies: currencies,
                    slug: slug,
                    eth_address: eth,
                    sol_address: sol,
                    products: products,
                    fields: fields,
                }),
                headers: {
                    'bearer-token': (_a = supabase_1.supabase.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token,
                },
            });
        }
        catch (e) {
            props.setIsOpen(false);
            react_hot_toast_1.default.dismiss(toastId);
            react_hot_toast_1.default.error("Can't create a store");
            return;
        }
        const res = yield data.json();
        (0, create_1.uploadFile)(logo, `${res.id}/logo.png`);
        react_hot_toast_1.default.dismiss(toastId);
        react_hot_toast_1.default.success('Successfully Created Store');
        // props.setIsOpen(false)
        setTweet(`https://wagpay.xyz/${props.username}/${slug}`);
        setStoreSuccess(true);
    });
    (0, react_1.useEffect)(() => console.log(products), [products]);
    return (<div className={(props.isOpen ? '' : 'hidden ') +
            'absolute top-0 right-0 z-50 h-screen w-11/12 lg:w-1/3 space-y-5 overflow-y-scroll bg-indigo-500 px-16 pt-10 text-white'}>
      <h1 className="text-3xl font-black">Create a New Store</h1>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Store Name</label>
        <input type="text" name="Store" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"/>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Store Logo</label>
        <div className="block h-full w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <input type="file" name="store_logo" onChange={(e) => handleImage(e.target.files, setLogo)} className="m-0 h-full w-full cursor-pointer rounded-full p-0 outline-none"/>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          Store Description (What you sell? Who you are?)
        </label>
        <textarea name="Store" value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"></textarea>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Store Slug (/store-name)</label>
        <input type="text" name="Store" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"/>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          Ethereum Address (If its blank, user's ethereum address will be user)
        </label>
        <input type="text" name="Store" value={eth} onChange={(e) => setETH(e.target.value)} className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"/>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          Solana Address (If its blank, user's ethereum address will be user)
        </label>
        <input type="text" name="Store" value={sol} onChange={(e) => setSOL(e.target.value)} className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"/>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Supported Currenices</label>
        <p>
          {currencies.map((v) => (<span>{v}</span>))}
        </p>
        <select className="form-select block
						w-1/3
						appearance-none
						rounded-xl
						border
						border-solid
						border-gray-300
						bg-white
						bg-clip-padding bg-no-repeat px-3
						py-1.5 text-base font-normal
						text-gray-700
						transition
						ease-in-out
						focus:border-indigo-600 focus:bg-white focus:text-gray-700 focus:outline-none" aria-label="Default select example" onChange={(e) => setCurrencies(() => [...currencies, e.target.value])}>
          {supported_currencies.map((value) => {
            return <option value={value}>{value}</option>;
        })}
        </select>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Form Fields</label>
        {fields.map((field, idx) => {
            return (<div key={idx} className="flex flex-col space-y-2">
              <h3>Field {field.name}</h3>
              <div className="flex space-x-2">
                <input value={field.name} onChange={(e) => changeField('name', e.target.value, idx)} type="text" name="Store" placeholder="Field Name" className="w-1/2 rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"/>
                <input value={field.type} onChange={(e) => changeField('type', e.target.value, idx)} type="text" name="Store" placeholder="Field Type" className="w-1/2 rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"/>
              </div>
            </div>);
        })}
        <button onClick={() => {
            setFields(() => [...fields, { name: '', type: '', value: '' }]);
        }} type="button" className="flex items-center justify-center space-x-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span>New Field</span>
          <span className="h-5 w-5">
            <solid_1.PlusIcon />
          </span>
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Products</label>
        {products.map((product, idx) => {
            return (<div key={idx} className="flex flex-col space-y-2">
              <h3>Product {product.name}</h3>
              <div className="flex space-x-2">
                <input value={product.name} onChange={(e) => changeProduct('name', e.target.value, idx)} type="text" name="Store" placeholder="Name" className="w-1/2 rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"/>
                <input value={product.discounted_price} onChange={(e) => changeProduct('discounted_price', e.target.value, idx)} type="text" name="Store" placeholder="Price" className="w-1/2 rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"/>
              </div>
              <input value={product.links.join()} onChange={(e) => changeProduct('links', e.target.value, idx)} type="text" name="Store" placeholder="Links" className="w-full rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"/>
              <textarea value={product.description} onChange={(e) => changeProduct('description', e.target.value, idx)} name="Store" placeholder="description" className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"></textarea>
            </div>);
        })}
        <button onClick={() => setProducts(() => [
            ...products,
            {
                discounted_price: 0,
                price: 0,
                name: '',
                description: '',
                links: [],
                image: null
            },
        ])} type="button" className="flex items-center justify-center space-x-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span>New Product</span>
          <span className="h-5 w-5">
            <solid_1.PlusIcon />
          </span>
        </button>
      </div>
      <button onClick={() => submit()} type="button" className="flex items-center justify-center space-x-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Submit
      </button>
      {storeSuccess && <StoreSuccess_1.default tweet_text={tweet}/>}
    </div>);
};
exports.default = NewStore;
