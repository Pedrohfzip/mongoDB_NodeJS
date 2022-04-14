const express = require("express");
const { redirect, type } = require("express/lib/response");
const mongoose = require("mongoose")
require("../Models/Categoria")
const Categoria = mongoose.model("categorias")
const router = express();

//Rota pagina index admin
router.get('/', (req,res) => {
    res.render("admin/index");
});


//Rota pagina todas categorias
router.get('/categorias', (req,res) => {
    Categoria.find({}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias});
    }).catch(() => {
        req.flash("error_msg", "Erro na busca de categorias")
    })

    
    
});

//Rota pagina formulario de cadastro de categorias
router.get('/categorias/formcategorias', (req,res) => {
    res.render("admin/formcategorias");
});

//Rota pagina update categoria
router.get('/categorias/formUpdate/:id', (req,res) => {
    Categoria.find({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/formUpdate", {categoria: categoria});
    })
    
});

router.post('/categorias/update', (req,res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
            console.log(`Cateogira: ${categoria}(${typeof categoria})`)
            console.log(`Nome inserido: ${req.body.nomeUpdate}(${typeof req.body.nomeUpdate})`)
            console.log(`ID: ${req.body.id}(${typeof req.body.id})`)
            categoria.updateOne(
                {_id: req.body.id},
                {
                nome: req.body.nomeUpdate
                }
            ).lean().then(()=>{
                console.log(`Atualizado com sucesso`)
                res.redirect("/admin/categorias")
            }).catch((e)=>{
                console.log(`${e}`)
            });
              
    }).catch((e) => {
        console.log(`${e}`)
    })
});

//Rota para adicionar a caterogira no banco
router.post('/categorias/addcategorias', (req,res) => {

    let errors = []
    
    //cria um objeto de uma nova categoria
    

    if(!req.body.nomecategoria || typeof req.body.nomecategoria == undefined || req.body.nomecategoria == null){

        req.flash("error_msg", "ERRO: Escreva o nome da categoria")
        res.redirect('/admin/categorias/formcategorias')

    }else{

        const newCategoria = {
            nome: req.body.nomecategoria
        }
        new Categoria(newCategoria).save().then( () => {
            req.flash('success_msg', "Categoria cadastrada com sucesso")
            res.redirect('/admin/categorias/formcategorias')
        }).catch( (e) => {
            req.flash("error_msg", "Erro no cadastro")
            res.redirect('/admin/categorias/formcategorias')
        });

    }

    if(errors.length > 0){
        res.render("admin/formcategorias", {errors: errors})
    }

    
    

    //Cadastra a categoria no banco
    
    
});




module.exports = router