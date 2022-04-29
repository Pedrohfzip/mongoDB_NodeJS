const express = require("express");
const { redirect, type } = require("express/lib/response");
const mongoose = require("mongoose")
require("../Models/Categoria")
require("../Models/Produto")
const Categoria = mongoose.model("categorias")
const Produto = mongoose.model("produtos")
const router = express();

/*
    //Organizador functions rotas

// <============= 
        //Paginas e Rotas 

// =============>

        
*/


//Rota pagina index admin
router.get('/', (req,res) => {
    //res.render("admin/index");
    
    Produto.find({}).populate("categoria").lean().then((produtos) => {
        res.render("admin", {produtos: produtos});
    }).catch(() => {
        req.flash("error_msg", "Erro na busca de produtos")
    })
    
});




// <============= 
        //Paginas e Rotas produtos

    //Rota pagina formulario add produtos
    router.get("/formprodutos", (req,res) => {
        Categoria.find({}).lean().then((categorias) => {
            res.render("admin/formprodutos", {categorias: categorias});
        }).catch(() => {
            req.flash("error_msg", "Erro na busca de categorias")
        }) 
    })
    //Rota addProdutos
    router.post("/addprodutos", (req,res) => {
        // console.log(
        //     `Nome produto: ${req.body.nomeproduto}`,
        //     `preco: ${req.body.preco}`,
        //     `categoria: ${req.body.categoria}`
        // )
        const newProduto = {
            nome: req.body.nomeproduto,
            preco: req.body.preco,
            categoria: req.body.categoria
        }
        new Produto(newProduto).save().then( () => {
            console.log(newProduto)
            req.flash('success_msg', "Produto cadastrada com sucesso")
            res.redirect('/admin/formprodutos')
        }).catch( (e) => {
            req.flash("error_msg", "Erro no cadastro")
            res.redirect('/admin/formprodutos')
        });
    })

    //Rota pagina formulario update produto
    router.get('/formUpdateProdutos/:id', (req,res) => {
        Produto.findOne({_id: req.params.id}).populate("categoria").lean().then((produtos) => {
            Categoria.find({}).lean().then((categorias) => {
                res.render("admin/formUpdateProdutos", {produtos: produtos, categorias: categorias });
            }).catch(() => {
                req.flash("error_msg", "Erro na busca de categorias")
            }) 
        })
        
        
    })

    router.post('/updateProduto', (req,res) => {
        Produto.findOne({_id: req.body.id}).then((produtos) => {
            produtos.nome = req.body.nomeProdutoUpdate,
            produtos.preco = req.body.precoUpdate,
            produtos.categoria = req.body.categoriaUpdate
            produtos.save().then(() =>{
                req.flash("success_msg", "Editou")
                res.redirect("/admin/")
            })

            // produtos.updateOne({id: req.body.id})
            // .set({
            //     nome: req.body.nomeProdutoUpdate,
            //     preco: req.body.precoUpdate,

            // }).then(()=>{
            //     console.log("Updtado")
            //     res.redirect("/admin/")
            // }).catch((e) => {
            //     console.log(`${e}`)
            // })

        }).catch((e) => {
            console.log(`${e}`)
        })
                
    });

    router.get('/deleteProduto/:id', (req,res) => {
    
        Produto.findOne({_id: req.params.id}).then((produtos) => {
            produtos.remove({id:{id:req.params.id}}, () => {
                res.redirect("/admin/")
            })
        }).catch((e) => {
            console.log(`${e}`)
        })
                    
                
        
    });
    


// =============>





// <=============   
        
        //Paginas e Rotas categorias

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

    //Rota pagina update categoria
    router.get('/categorias/formUpdateCategoria/:id', (req,res) => {
        Categoria.find({_id: req.params.id}).lean().then((categoria) => {
            res.render("admin/formUpdateCategoria", {categoria: categoria});
    })
        
    });
    //Rota para update
    router.post('/categorias/update', (req,res) => {
        Categoria.findOne({_id: req.body.id}).then((categoria) => {
            categoria.updateOne({id: req.body.id})
            .set({
                nome: req.body.nomeUpdate
            }).then(()=>{
                console.log("Updtado")
                res.redirect("/admin/categorias")
            }).catch((e) => {
                console.log(`${e}`)
            })
        }).catch((e) => {
            console.log(`${e}`)
        })
                
    });


    //Rota para delete categoria
    router.get('/categorias/delete/:id', (req,res) => {
        
        
        Categoria.findOne({_id: req.params.id}).then((categoria) => {
            categoria.remove({id:{id:req.params.id}}, () => {
                res.redirect("/admin/categorias")
            })
        }).catch((e) => {
            console.log(`${e}`)
        })
                    
                
        
    });

// =============>





module.exports = router