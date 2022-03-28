
let _W = window.innerWidth
let _H = window.innerHeight

let app = new PIXI.Application({ width: _W, height: _H });
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x0faaf0


const rows = 10
const cols = 15
const margin = 1
let cellSize = Math.min(_W/(cols+margin*2), _H/(rows+margin*2))
let width = cellSize*cols
let height = cellSize*rows
const T = {}


const vec2 = (x, y)=>{
	return `${x}:${y}`
}

const render = ()=>{
	board.clear()
	//rectangle
	board.beginFill(0xeeeeee)
	board.lineStyle(2, 0x000000)
	board.drawRect(0, 0, width, height)

	//grid
	board.lineStyle(1, 0xaaaaaa)
	for(let i=1; i<cols; i++){
		board.moveTo(i*cellSize, 0)
		board.lineTo(i*cellSize, height)
	}
	for(let i=1; i<rows; i++){
		board.moveTo(0, i*cellSize)
		board.lineTo(width, i*cellSize)
	}

	//position
	const offsetX = (_W-width)/2
	const offsetY = (_H-height)/2
	board.x = offsetX
	board.y = offsetY
}

const board = new PIXI.Graphics()
app.stage.addChild(board)
render()

const loop = ()=>{


}
loop()

//window resize
window.addEventListener('resize', ()=>{
	_W = window.innerWidth
	_H = window.innerHeight
	cellSize = Math.min(_W/(cols+margin*2), _H/(rows+margin*2))
	width = cellSize*cols
	height = cellSize*rows
	app.renderer.resize(_W, _H)
	board.clear()
	render()
})