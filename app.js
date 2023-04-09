
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const _=require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


// const server="mongodb://127.0.0.1:27017/ScienceDB";

const server=process.env.SERVER;
mongoose.connect(server,{useNewUrlParser:true});

const instructionSchema = new mongoose.Schema({
    step: Number,
    image: String,
    about: String
});

const schema = new mongoose.Schema({ 
    name: String, 
    description: String,
    level: Number,
    subject: String ,
    image: String,
    materials:String,
    safety: String,
    instructions:[instructionSchema]

});
const Post = mongoose.model('Post',schema);

app.get("/",function(req,res)
{
  const homeStartingContent =new Post({
    name:"Volcano Eruption",
    description:"A chemical reaction between vinegar and baking soda creates a gas called carbon dioxide. Carbon dioxide is the same type of gas used to make the carbonation in sodas. What happens if you shake up a soda? The gas gets very excited and tries to spread out. There is not enough room in the bottle for the gas to spread out so it leaves through the opening very quickly, causing an eruption!",
    level:3,
    subject:'Chemistry',
    image:'https://www.bgs.ac.uk/wp-content/uploads/2020/04/StructureOfaVolcano_website.jpg',
    materials:'10 ml of dish soap , 100 ml of warm water , 400 ml of white vinegar , Food coloring , Baking soda slurry (fill a cup about ½ with baking soda, then fill the rest of the way with water) , Empty 2 liter soda bottle',
    safety:'This experiment should be done outside due to the mess. Baking soda should be added in sufficient quantity such that eruption takes place in a proper way. Don’t look down into the volcano while it erupts! Stand back after you pour in the vinegar!',
    instructions:[{
      step:1,
      image:'https://sciencebob.com/wp-content/uploads/2014/11/Volcano1.png',
      about:'Combine the vinegar, water, dish soap and 2 drops of food coloring into the empty soda bottle. Use a spoon to mix the baking soda slurry until it is all a liquid.'
    },
    {
      step:2,
      image:'https://i.pinimg.com/originals/95/ff/7c/95ff7cb1d14e501b2e10cac0a806a1c3.jpg',
      about:'Eruption time! Pour the baking soda slurry into the soda bottle quickly and step back!'
    }]
  });
  Post.findOne({name:"Volcano Eruption"}).then((con) => 
  {
    if(con==null)
    {
        homeStartingContent.save();
        res.redirect('/');
    }
    else
    {
        Post.find().then((experiments)=>
        {
            res.render('home',{homeStartingContent: homeStartingContent, experiments: experiments});
        });
    }
    
  });
});

app.get("/experiments/:name",function(req,res){
    Post.findOne({name:req.params.name}).then((experiment)=>
    {
        res.render('experiments',{experiment:experiment});
    });
});

app.get("/compose",function(req,res){
    res.render('compose');
});
 
app.post("/compose",function(req,res){

  console.log("req.body:"+req.body.instructions);
    const customExperiment = new Post({
        name:req.body.name,
        description:req.body.description,
        level:req.body.level,
        subject:req.body.subject,
        image:req.body.image,
        materials:req.body.materials,
        safety:req.body.safety,
        instructions:JSON.parse(req.body.instructions)
    });
    customExperiment.save();
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});












// app.get("/about",function(req,res){
//     const aboutContent =new Post({postHeading:"About",postContent:"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."});
    
//     Post.findOne({postHeading:"About"}).then((foundUser) => 
//     {
//       if(foundUser==null)
//       {
//         aboutContent.save();
//         res.redirect('/about');
//       }
//       else
//       {
//         const content=foundUser;
//         console.log(content);
//         res.render('about',{aboutContent: content.postContent});
//       }
     
//     });
//   });