const inputControlsData = [
{
    label:'UserID',
    name:'userId',  
    tag:'input',
    type:'text',
    placeholder:'Enter User ID',
    val:'',
    error:'',
    required:true
},
{
    label:'Password',
    name:'password',  
    tag:'input',        
    type:'password',
    val:'',
    error:'',
    placeholder:'Enter Password',
    required:true
},
{
    label:'Gender',
    name:'gender',
    type:'radio',
    options:['Male','Female'],
    val:'',
    error:'',
    required:true

},
{
    label:'Hobbies',
    name:'hobbies',
    type:'checkbox',
    options:['Reading','Traveling','Gaming'],
        val:[],
        error:'',
    required:true
},
{
    label:'Country',
    name:'country',  
    type:'dropdown',
    options:['India','USA','UK','Canada','Australia','china','pakistan','Brazil','Germany','France','Italy','Russia','Japan'],
    val:'',
    error:'',
    required:true
},
{
    label:'Address',
    name:'address',
    type:'textArea',
    placeholder:'Enter Address',
    required:false
},
{
    label:'Photo',
    name:'photo',  
    type:'file',
    required:false
}
];

export default inputControlsData;   