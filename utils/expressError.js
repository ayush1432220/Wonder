class expressError extends Error{
    constructor(statuscode,message){
        super();
        this.message=message;
        this.statuscode=statuscode;
    }
}
module.exports=expressError;