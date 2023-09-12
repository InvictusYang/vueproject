//封装一个判断时间的函数：早上|上午|下午|晚上
export const getTime=()=>{
    let message = ""
    //通过内置构造函数Date
    let hour = new Date().getHours()
    if(hour <= 9){
        message='早上好!'
    }else if(hour <= 12){
        message="上午好！"
    }else if(hour <= 18){
        message = "下午好!"
    }else{
        message = "晚上好!"
    }
    return message
}
