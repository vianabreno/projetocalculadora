class Calculadora {

    constructor(){
        this._playMp = new Audio('click.mp3')
        this._audioOnOf = true
        this._operation = []
        this._displayCalc = document.querySelector("#numbers")
        this._displayHora = document.querySelector("#hora")
        this._displayData = document.querySelector("#data")
        this._audioDiv = document.querySelector('#audio')
        this._time;
        this.inicializacao()
        this.clickbuttons()
        this.clickKeys()
    }

    inicializacao(){

        this.displayData = this.time.toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric',})
        this.displayHora = this.time.toLocaleTimeString('pt-BR')
        this.toqueSom()

        setInterval(()=>{
            this.displayData = this.time.toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric',})
            this.displayHora = this.time.toLocaleTimeString('pt-BR')

        }, 1000)

        
        this._audioDiv.addEventListener('click', a=>{
            this.toqueSom()
        })

        this.setToDisplay()
    }


    toqueSom(){
        if(this._audioOnOf){
            this._audioOnOf = false
            this._audioDiv.style.backgroundColor = '#ff0000b2'
            this._audioDiv.style.cursor = 'pointer'
        } else{
            this._audioOnOf = true
            this._audioDiv.style.backgroundColor = '#008000a6'
            this._audioDiv.style.cursor = 'pointer'
            window.alert('Você ligou o som da calculadora! ')
        }
    }

    playAudio(){
        if(this._audioOnOf){

            this._playMp.currentTime = 0;
            this._playMp.play()
            
        }
    }

    addEventListenerAll(elementos, eventos, fns){
        eventos.split(' ').forEach((evento)=>{
            elementos.addEventListener(evento, fns)
        })
    }

    clickbuttons(){
        let bot = document.querySelectorAll('#bottonsCostumerOne > input, #bottonsCostumerTwo > input')
        bot.forEach((bott, index)=>{
            this.addEventListenerAll(bott, 'click drag', c =>{
                let text=(bott.value)
                this.excTxt(text)
            })

            this.addEventListenerAll(bott, 'mousemove mouseup', pointer =>{
                bott.style.cursor = 'pointer'
            })
        })
    }

    setLastOperation(){
        return this._operation[this._operation.length -1]
    }

    isOperation(valor){
        return (['%', '/', '*', '-', '+'].indexOf(valor) > -1)
    }

    pushOperations(valor){
        this._operation.push(valor)
        if(this._operation.length > 3){
            this.exeCut()
        }
    }

    exeCut(){
        let last = ''

        if(this._operation.length > 3){
            last = this._operation.pop()
        }

        let result = eval(this._operation.join(''))

        if(last == '%'){
            result /= 100;
            this._operation = [result]
        }else{
            this._operation = [result]
            if(last) this._operation.push(last)
        }
        
        this.setToDisplay()
    }

    clickKeys(){
        document.addEventListener('keyup', e =>{
            
            this.playAudio()

            switch(e.key){

                case 'Backspace':
                    this.clearEntry()
                    break;
    
                case 'Escape':
                    this.allClear()
                    break;
    
                case '/':
                case '%':
                case '*':
                case '-':
                case '+':
                    this.setOperation(e.key)
                    break;
    
                case 'Enter':
                case '=':
                    this.exeCut()
                    break;
    
                case '.':
                case ',':
                    this.addDot()
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.setOperation(parseInt(e.key))
                    break;
                }
           })
    }

    addDot(){
        let lasOperationDoit = this.setLastOperation();

        if(typeof lasOperationDoit === 'string' && lasOperationDoit.split('').indexOf('.') > -1) return;

        if(this.isOperation(lasOperationDoit) || !lasOperationDoit){
            this._operation.push('0.')

        } /*else if(lasOperationDoit == 0){
           lasOperationDoit.toString() + '.'

        } */
        else{
            this._operation[this._operation.length -1] = lasOperationDoit.toString() + '.'
        }

        this.setToDisplay()
    }

    setToDisplay(){
        let number;
        for(let i = this._operation.length - 1; i >=0 ; i--){
            if(!this.isOperation(this._operation[i])){
                number = this._operation[i]
                break;
            }
        }
        if(!number) number = 0;
        this.displayCalc = number
    }

    setOperation(valor){
        if(isNaN(this.setLastOperation())){
            if(this.isOperation(valor)){
                this._operation[this._operation.length -1] = valor
            } else{
                this.pushOperations(valor)
                this.setToDisplay()
            }
        } else{
            if(this.isOperation(valor)){
                this.pushOperations(valor)
                
            } else{
                let newValor = this.setLastOperation().toString() + valor.toString()
                this._operation[this._operation.length -1] = newValor
                this.setToDisplay()
            }
        }

        console.log(this._operation)
    }

    clearEntry(){
        this._operation.pop()
        this.setToDisplay()
    }

    allClear(){
        this._operation = []
        this.setToDisplay()
    }

    setError(){
        this.displayCalc = 'ERROR'
        
    }

    excTxt(valor){

        this.playAudio()

        switch(valor){
            case 'CE':
                this.clearEntry()
                break;

            case 'AC':
                this.allClear()
                break;

            case '/':
            case '%':
            case '*':
            case '-':
            case '+':
                this.setOperation(valor)
                break;

            case '=':
                this.exeCut()
                break;

            case '.':
                this.addDot()
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.setOperation(parseInt(valor))
                break;

            default:
                this.setError()
                break;

        }
    }

    get displayCalc(){
        return this._displayCalc.innerHTML;
    }

    set displayCalc(valor){
        if(valor.toString().length > 12){
            this.setError()
            return false;
        }

        this._displayCalc.innerHTML = valor;
    }

    get displayHora(){
        return this._displayHora.innerHTML;
    }

    set displayHora(valor){
        this._displayHora.innerHTML = valor;
    }

    get displayData(){
        return this._displayData.innerHTML;
    }

    set displayData(valor){
        this._displayData.innerHTML = valor;
    }

    get time(){
        return new Date()
    }

    set time(valor){
        this._time.innerHTML = valor;
    }
}