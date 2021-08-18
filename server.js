const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models');
const port = 8080;

app.use(express.json());
app.use(cors());

app.get('/products', (req, res) => {
    models.Product.findAll({
        //order: [['createdAt', 'DESC']],
        //limit : 1, //리턴 개수제한
        attributes: ['id', 'name', 'price', 'createdAt', 'seller', 'imageUrl'], //필요한 컬럼만 리턴
    })
        .then((result) => {
            console.log('PRODUCTS : ', result);
            res.send({
                products: result,
            });
        })
        .catch((error) => {
            console.error(error);
            res.send('에러발생');
        });
});
app.post('/products', (req, res) => {
    const body = req.body;
    const { name, description, price, seller } = body;
    if (!name || !description || !price || !seller) {
        res.send('json field error');
    }
    models.Product.create({
        name,
        description,
        price,
        seller,
    })
        .then((result) => {
            console.log('상품 생성 결과', result);
            res.send({
                result,
            });
        })
        .catch((error) => {
            console.error(error);
            res.send('상품 업로드에 문제가 발생했습니다.');
        });
});

app.get('/products/:id', (req, res) => {
    const params = req.params;
    const { id } = params;
    models.Product.findOne({
        where: {
            id: id,
        },
    })
        .then((result) => {
            console.log('PRODUCT : ', result);
            res.send({
                product: result,
            });
        })
        .catch((error) => {
            console.error(error);
            res.send('상품 조회 에러 발생');
        });
});

app.listen(port, () => {
    console.log('그랩의 쇼핑몰 서버 is Running');
    models.sequelize
        .sync()
        .then(() => {
            console.log('DB연결성공');
        })
        .catch((err) => {
            console.error(err);
            console.log('DB연결에러');
            process.exit();
        });
});
