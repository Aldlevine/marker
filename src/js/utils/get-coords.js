export function getCoords (e)
{
  let x, y;
  if (e.touches)
  {
    let touch = e.touches[0];
    x = touch.clientX;
    y = touch.clientY;
  }
  else
  {
    x = e.clientX;
    y = e.clientY;
  }
  return {x, y};
}

