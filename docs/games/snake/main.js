
let _W = window.innerWidth
let _H = window.innerHeight

let app = new PIXI.Application({ width: _W, height: _H });
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x0faaf0

const border_thickness = 5
const rows = 10
const cols = 15
const margin = 1
let cellSize = Math.min(_W/(cols+margin*2), _H/(rows+margin*2))
let width = cellSize*cols
let height = cellSize*rows
const speed = 3


const S = [[1, 0], [0, 0]]
let direction = 1 


const vec2 = (x, y)=>{
	return `${x}:${y}`
	//
}

const updateBoard = ()=>{
	board.clear()
	//white rectangle
	board.beginFill(0xeeeeee)
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
	//outlines
	board.endFill()
	board.lineStyle(border_thickness, 0x000000)
	board.drawRect(-border_thickness/2, -border_thickness/2, width+border_thickness, height+border_thickness)

	//position
	const offsetX = (_W-width)/2
	const offsetY = (_H-height)/2
	board.x = offsetX
	board.y = offsetY
}

const step = ()=>{
	for(let i=S.length-1; i>0; i--){
		S[i] = S[i-1]
	}
	const head = S[0]
	let step = [0, 0]

	if(direction == 1){
		step = [1, 0]
	}else if(direction == 2){
		step = [0, 1]
	}else if(direction == 3){
		step = [-1, 0]
	}else if(direction == 4){
		step = [0, -1]
	}

	S[0] = [head[0]+step[0], head[1]+step[1]]
	updateSnake()
}

const updateSnake = ()=>{
	snake.clear()
	snake.beginFill(0x00ff00)

	//segments
	for(let i of S){
		snake.drawRect(i[0]*cellSize, i[1]*cellSize, cellSize, cellSize)

	}

	//position
	const offsetX = (_W-width)/2
	const offsetY = (_H-height)/2
	snake.x = offsetX
	snake.y = offsetY
}

const board = new PIXI.Graphics()
app.stage.addChild(board)
updateBoard()

const snake = new PIXI.Graphics()
app.stage.addChild(snake)
updateSnake()


const keys = {}
window.addEventListener('keydown', (e)=>{
	keys[e.code] = true
})
window.addEventListener('keyup', (e)=>{
	keys[e.code] = null
})
const events = {
	ArrowRight(){
		direction = 1
	},
	ArrowDown(){
		direction = 2
	},
	ArrowLeft(){
		direction = 3
	},
	ArrowUp(){
		direction = 4
	}
}

let timeStamp = Date.now()
const loop = ()=>{
	requestAnimationFrame(loop)
	if(Date.now()-timeStamp>=1000/speed){
		timeStamp = Date.now()
		step()
	}

	for(const i in events){
		if(keys[i]){
			events[i]()
		}
	}

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
	updateBoard()
	updateSnake()
})