import { map } from 'root/config';

class UI {
  /**
   * Calculates the current mouse position in pixels from the canvas
   *
   * @param {*} event The event dispatched when a mouseover fires
   * @return {object} The x,y coordinates of the mouse on the canvas viewport
   */
  static getMousePos(event) {
    const eventTarget = event.currentTarget || document.querySelector('#game-map');
    const rect = eventTarget.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  /**
   * Get the correct color to label the context subject
   *
   * @param {string} data Incoming context type
   */
  static getContextSubjectColor(data) {
    if (data === 'npc') {
      return map.color.npc;
    } else if (data === 'item') {
      return map.color.item;
    } else if (data === 'action') {
      return map.color.action;
    }
    return 'inherit';
  }

  /**
   * Gets the current tile ID where the mouse is currently hovering over on the canvas
   *
   * @param {array} board The elements of the board
   * @param {integer} playerX The current x-axis of the player
   * @param {integer} playerY The current y-axis of the player
   * @param {integer} mouseX The current x-axis of the mouse on the viewport
   * @param {integer} mouseY The current y-axis of the mouse on the viewport
   * @param {string} layer The layer of our tile
   *
   * @returns {integer}
   */
  static getTileOverMouse(board, playerX, playerY, mouseX, mouseY, layer = 'background') {
    const tile = (((mouseY + (playerY - 5)) * map.size.x) + mouseX) + (playerX - 7);

    if (board !== undefined) {
      const specialEquation = layer === 'foreground' ? 253 : 1;
      return board[tile] - specialEquation;
    }

    return -1;
  }

  /**
   * Checks to see if the tile can be walked through or not
   *
   * @param {integer} tile The ID of the tile
   * @param {string} layer Check the foreground or background
   * @returns {boolean}
   */
  static tileWalkable(tile, layer = 'background') {
    const certainLayer = layer === 'background' ? map.tileset : map.objects;
    return certainLayer.blocked.indexOf(tile) === -1;
  }

  /**
   * Find which way for the player to move next for pathfinding
   *
   * @param {object} steps The steps of the current and next in the iteration
   * @returns {boolean}
   */
  static getMovementDirection(steps) {
    const currentX = steps.current.x;
    const currentY = steps.current.y;
    const nextX = steps.next.x;
    const nextY = steps.next.y;
    let direction = null;

    if (nextX === currentX && nextY < currentY) direction = 'up';
    if (nextX === currentX && nextY > currentY) direction = 'down';
    if (nextX > currentX && nextY === currentY) direction = 'right';
    if (nextX < currentX && nextY === currentY) direction = 'left';

    return direction;
  }

  /**
   * Find the nearest open slot in your inventory
   *
   * @param {array} inventory Your current inventory
   * @returns {integer}
   */
  static getOpenSlot(inventory) {
    if (inventory.length === 0) return 0;
    let slotPosition = false;

    for (let index = 0; index < 23; index += 1) {
      if (!inventory.find(e => e.slot === index) && slotPosition === false) {
        slotPosition = index;
      }
    }

    return slotPosition;
  }

  /**
   * Calculate the x,y position on the viewport when clicked on canvas
   *
   * @param {event} event The mouse-click on the game viewport
   * @returns {object}
   */
  static getViewportCoordinates(event) {
    const { tile } = map.tileset;

    const coordinates = {
      x: Math.floor(this.getMousePos(event).x / tile.width),
      y: Math.floor(this.getMousePos(event).y / tile.height),
    };

    return coordinates;
  }

  /**
   * Return whether the user pressed an arrow key (to move)
   *
   * @param {string} key The key code of the event of EventListner from canvas
   * @returns {boolean}
   */
  static userPressToMove(key) {
    return key.search('Arrow') > -1;
  }

  /**
   * Generates a random number between a pair
   *
   * @param {integer} min The lesser number
   * @param {integer} max The greater number
   * @returns {integer}
   */
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  }

  /**
   * Checks the tile 1 square in that direction
   *
   * @param {array} board The main board map
   * @param {integer} x The x-axis on where the tile is
   * @param {integer} y The y-axis on where the tile is
   * @param {string} direction Where they are going
   * @returns {integer}
   */
  static getFutureTileID(board, x, y, direction) {
    const getY = (dirMove) => {
      if (dirMove === 'right' || dirMove === 'left') return 1;
      return dirMove === 'up' ? 0 : 2;
    };

    const getX = (dirMove) => {
      if (dirMove === 'up' || dirMove === 'down') return 0;
      return dirMove === 'left' ? -1 : 1;
    };

    return board[((map.size.y * (y + getY(direction))) - (map.size.x - (x + getX(direction))))] - 1;
  }

  /**
   * Obtain the full information of an item by its ID
   *
   * @param {integer} id The ID of the item
   * @returns {object}
   */
  static getItemData(id) {
    return window.allItems.map((t) => {
      t.context = 'item';
      return t;
    }).find(item => item.id === id);
  }
}

export default UI;