import './ProductForm.css';

import React, { useCallback, Fragment } from 'react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Btn from '../../ui/btn/Btn';
import Loader from '../../ui/loader/Loader';

function ProductForm(props) {
  const initialProduct = {
    title: '',
    price: 0,
    payPeriodType: 'monthly',
    upFrontPaymentAmount: 0,
    periodicalPaymentAmount: 0,
    desc: '',
    image: null,
  };
  const [product, setProduct] = useState(initialProduct);

  const [imageName, setImageName] = useState('');
  const [triedToAdd, setTriedToAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const image = acceptedFiles[0];

    try {
      if (
        image.type !== 'image/png' &&
        image.type !== 'image/jpg' &&
        image.type !== 'image/jpeg' &&
        image.type !== 'image/bmp'
      ) {
        throw new Error('يجب ان يكون الملف صورة');
      }

      if (image.size > 15000000) {
        throw new Error('حجم الصورة لا يتجاوز ال12 ميكا بايت');
      }

      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.onload = () => {
        const binaryStr = reader.result;
        setImageName(image.name);
        setProduct((_product) => {
          return { ..._product, image: binaryStr };
        });
      };

      reader.readAsArrayBuffer(image);
    } catch (err) {
      alert(err.message);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let payPersentageOptions = [];
  for (let i = 0; i < 20; i++) {
    payPersentageOptions.push(
      <option key={i} value={i / 20}>
        {i * 5}%
      </option>
    );
  }

  const addProduct = () => {
    setTriedToAdd(true);
    if (
      !product.title ||
      !product.price ||
      !product.periodicalPaymentAmount ||
      !product.upFrontPaymentAmount ||
      product.periodicalPaymentAmount > product.price ||
      product.upFrontPaymentAmount > product.price
    ) {
      return alert('تأكد من ادخال المعلومات بشكل صحيح');
    }

    setLoading(true);

    return e_products.addProduct(product, (err, result) => {
      setProduct(initialProduct);
      setImageName('');
      setLoading(false);
      setTriedToAdd(false);

      if (err) {
        return alert('فشلت اضافة السلعة');
      }

      if (result) {
        props.onSaveProduct(result);
        return alert('تمت اضافة السلعة');
      }
    });
  };

  const deleteImage = () => {
    setProduct((_product) => {
      return { ..._product, image: null };
    });
    setImageName('');
  };

  return (
    <div className="products-form">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="title">اضافة سلعة</h2>
          <div className="inputs-control">
            <div className="input-continaer">
              <label htmlFor="title">عنوان السلعة: </label>
              <input
                type="text"
                id="title"
                name="title"
                className={!product.title && triedToAdd ? 'unvalid' : ''}
                value={product.title}
                onChange={(e) => {
                  setProduct((_product) => {
                    return { ...product, title: e.target.value };
                  });
                }}
              />
            </div>

            <div className="input-contianer">
              <label htmlFor="price">السعر: </label>
              <input
                type="number"
                id="price"
                name="price"
                step={5000}
                value={product.price}
                className={!product.price && triedToAdd ? 'unvalid' : ''}
                onChange={(e) => {
                  console.log();
                  setProduct((_product) => {
                    return {
                      ...product,
                      price:
                        10000000000 > +e.target.value && +e.target.value >= 0
                          ? +e.target.value
                          : _product.price,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="inputs-control upFront-inputs">
            <div className="input-container">
              <label htmlFor="payPersentage">المقدم (نسبة): </label>
              <select
                id="payPersentage"
                onChange={(e) => {
                  setProduct((_product) => {
                    return {
                      ..._product,
                      upFrontPaymentAmount: Math.round(
                        _product.price * e.target.value
                      ),
                    };
                  });
                }}
              >
                {payPersentageOptions}
              </select>
            </div>
            <div className="input-continer">
              <label htmlFor="upFrontPaymentAmount">المقدم: </label>
              <input
                type="number"
                step={5000}
                id="upFrontPaymentAmount"
                name="upFrontPaymentAmount"
                value={product.upFrontPaymentAmount}
                className={
                  (!product.upFrontPaymentAmount && triedToAdd) ||
                  product.upFrontPaymentAmount > product.price
                    ? 'unvalid'
                    : ''
                }
                onChange={(e) => {
                  setProduct((_product) => {
                    return {
                      ...product,
                      upFrontPaymentAmount:
                        10000000000 > +e.target.value && +e.target.value >= 0
                          ? +e.target.value
                          : _product.upFrontPaymentAmount,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="inputs-control">
            <div className="input-container">
              <label htmlFor="payPeriodType">نوع القسط: </label>
              <select
                name="payPeriodType"
                id="payPeriodType"
                value={product.payPeriodType}
                onChange={(e) => {
                  setProduct((_product) => {
                    return { ...product, payPeriodType: e.target.value };
                  });
                }}
              >
                <option value="weekly">اسبوعيا</option>
                <option value="monthly">شهريا</option>
                <option value="yearly">سنويا</option>
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="payPersentage">القسط (نسبة): </label>
              <select
                id="payPersentage"
                onChange={(e) => {
                  setProduct((_product) => {
                    return {
                      ..._product,
                      periodicalPaymentAmount: Math.round(
                        _product.price * e.target.value
                      ),
                    };
                  });
                }}
              >
                {payPersentageOptions}
              </select>
            </div>

            <div className="input-container">
              <label htmlFor="periodicalPaymentAmount">القسط: </label>
              <input
                type="number"
                id="periodicalPaymentAmount"
                name="periodicalPaymentAmount"
                step={5000}
                value={product.periodicalPaymentAmount}
                className={
                  (!product.periodicalPaymentAmount && triedToAdd) ||
                  product.periodicalPaymentAmount > product.price
                    ? 'unvalid'
                    : ''
                }
                onChange={(e) => {
                  setProduct((_product) => {
                    return {
                      ...product,
                      periodicalPaymentAmount:
                        10000000000 > +e.target.value && +e.target.value >= 0
                          ? +e.target.value
                          : _product.periodicalPaymentAmount,
                    };
                  });
                }}
              />
            </div>
          </div>
          <p>الملاحظات: </p>
          <textarea
            name="desc"
            value={product.desc}
            onChange={(e) => {
              setProduct((_product) => {
                return {
                  ...product,
                  desc: e.target.value,
                };
              });
            }}
            id="desc"
            rows="10"
          ></textarea>

          <div className="image-dragndrop_container">
            {product.image ? (
              <p className="image-placeholder" onDoubleClick={deleteImage}>
                {imageName}
              </p>
            ) : (
              <div className="image-dragndrop" {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>ضع الصورة هنا</p>
                ) : (
                  <p>اسحب صورة للسلعة وضعها هنا (اختياري)</p>
                )}
              </div>
            )}
          </div>

          <Btn onClick={addProduct}>اضافة</Btn>
        </Fragment>
      )}
    </div>
  );
}

export default ProductForm;
