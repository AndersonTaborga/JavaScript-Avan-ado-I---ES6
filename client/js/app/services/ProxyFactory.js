class ProxyFactory {

    static create(objeto, props, acao) {
        
        return new Proxy(objeto, {
            
                        get(target, prop, receiver) {
            
                            if(props.includes(prop) && ProxyFactory._ehFuncao(target[prop]))  {
            
                                return function() {
                                    
                                    console.log(`interceptando: ${prop}`);
                                    Reflect.apply(target[prop], target, arguments);
                                    return acao(target);
            
                                }
                            }
            
                            return Reflect.get(target, prop, receiver);

            
                            //console.log(`valor anterior: ${target[prop]}, novo valor: ${value}`);
                            //return Reflect.set(target, prop, value, receiver);
                        },

                        set(target, prop, value, receiver) {
                            if(props.includes(prop)) {
                                acao(target);
                            }
                            return Reflect.set(target, prop, value, receiver);
                        }
            
                    });
    }

    static _ehFuncao(func) {
        return typeof(func) == typeof(Function);
    }
}