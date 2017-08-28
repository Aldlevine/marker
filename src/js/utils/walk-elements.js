export function walkElements(from, to, includeText, fn)
{
  // to is before from
  if (from.compareDocumentPosition(to) & Node.DOCUMENT_POSITION_PRECEDING)
  {
    let tmp = from;
    from = to;
    to = tmp;
  }

  const SIBLING = 0;
  const CHILD = 1;
  const PARENT = -1;

  let $from = $(from);
  let $to = $(to);

  let $el = $from;
  let $children;
  let next;
  let direction = SIBLING;
  let newEl;
  let foundTo = false;
  let childrenFn = includeText ? 'contents' : 'children';
  while (true) {
    newEl = fn($el[0], direction);
    direction = SIBLING;

    // Fn returned new el
    if (newEl)
    {
      $el = $(newEl);
    }

    // Found to
    if ($el.is(to))
    {
      foundTo = true;
    }

    // Found element with children
    if (($children = $el[childrenFn]()).length && !newEl)
    {
      $el = $children.first();
      direction = CHILD;
      continue;
    }

    // End of element
    while (!(next = $el[0].nextSibling))
    {
      $el = $el.parent();
      direction = PARENT;
    }
    if (direction == PARENT)
    {
      if (foundTo)
      {
        break;
      }
      $el = $(next);
      continue;
    }

    if (foundTo)
    {
      break;
    }

    $el = $(next);
  }
}
