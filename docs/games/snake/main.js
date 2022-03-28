
let _W = window.innerWidth
let _H = window.innerHeight

let app = new PIXI.Application({ width: _W, height: _H });
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x0faaf0




const loop =()=>{


}
loop()

//window resize
window.addEventListener('resize', ()=>{
	_W = window.innerWidth
	_H = window.innerHeight
	app.renderer.resize(_W, _H)
})