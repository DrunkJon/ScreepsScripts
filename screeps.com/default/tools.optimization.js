

var toolsOptimazation = {
    //evalfunction should give a number for valid variations
    //variant should give random variations of the imput val 
    schwellenwert_akzeptanz: function(start_val, eval_function, variant_function, start_schwelle, iterations, min = true){
        let old_val = start_val
        let schwelle = Math.abs(start_schwelle)
        let dec = - schwelle / Math.floor(iterations * 0.9)
        for(var i = 0; i < iterations; i++){
            new_val = variant_function(old_val)
            console.log('iteration: ' + i + '| schwelle: ' + schwelle)
            console.log('old: ' + old_val + ' | f(old): ' + eval_function(old_val) )
            console.log('new: ' + new_val + ' | f(new): ' + eval_function(new_val) + '\n' )
            if((min && eval_function(new_val) < eval_function(old_val) + schwelle) || (!min && eval_function(new_val) > eval_function(old_val) - schwelle)){
                old_val = new_val
            }
            schwelle = (schwelle < 1)? 0 : schwelle + dec
        }

        return old_val
    }
}

function eval(list){
    sum = 0
    list.forEach(item => {
        sum += item
    })
    return sum
}

function variation(list){
    let clone = [].concat(list)
    if(clone.length > 1 && Math.random() < 0.5){
        clone.shift()
        return clone
    } else {
        clone.push(-10 + 20*Math.random())
        return clone
    }
}

solution = toolsOptimazation.schwellenwert_akzeptanz([1,0,-1], eval, variation, 5, 50)

console.log(solution + ' : ' + eval(solution))
console.log('finished code')

//module.exports = toolsOptimazation