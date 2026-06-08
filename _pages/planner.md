---
title: Planner
description: Weekly planner & daily task checklists.
background: /assets/img/bg-planner.jpg
---


## Weekly Goals
{: .goals-title}

- [ ] Compare the response of a accelerometer and a lase vibrometer on a single point in a out-of-plane direction
- [ ] Measere the response of catilever beam on several points along the beam with a acelerometer and a laser vibrometer
- [ ] Simulate the calilever beam in FEMAP
- [ ] Obtain the response of 3D measurements of a single point using the vibrometer

<hr class="section-divider">

## Daily Tasks
{: .daily-tasks-title}

### Monday — Jun 8
{: .day-title}

- [X] Email Rui Moreira about the color of the markers for 3D printing
- [X] Email Sérgio Tavares about the Revopoint license
- [X] Check the laboratory computer's battery settings
- [ ] Find, choose, and embed a beam
- [ ] Set up the experimental apparatus
- [ ] Compare the accelerometer and laser vibrometer response at a point on the beam

### Tuesday — Jun 9
{: .day-title}

- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

### Wednesday — Jun 10
{: .day-title}

- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

### Thursday — Jun 11
{: .day-title}

- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

### Friday — Jun 12
{: .day-title}

- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

<script>
(function() {
  // Convert plain <li>[ ]</li> to checkboxes and enable GFM task lists
  document.querySelectorAll('h2.goals-title + ul, h3.day-title + ul, ul.task-list').forEach(function(ul) {
    ul.classList.add('task-list');
    ul.querySelectorAll('li').forEach(function(li) {
      var text = li.textContent.trim();
      var checked = false;

      // GFM task list — already has checkbox but may be disabled
      var cb = li.querySelector('.task-list-item-checkbox, input[type=checkbox]');
      if (cb) {
        cb.removeAttribute('disabled');
        cb.type = 'checkbox';
        cb.className = 'task-checkbox';
        // move checkbox to front, wrap remaining text in span
        var span = document.createElement('span');
        span.textContent = li.textContent;
        li.innerHTML = '';
        cb.checked = cb.hasAttribute('checked');
        li.appendChild(cb);
        li.appendChild(span);
        return;
      }

      // Plain text <li>[ ]</li> or <li>[x]</li>
      if (/^\[x\]/i.test(text)) { checked = true; text = text.replace(/^\[x\]\s*/i, ''); }
      else if (/^\[ \]/.test(text)) { text = text.replace(/^\[ \]\s*/, ''); }
      else return;

      li.innerHTML = '';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'task-checkbox';
      if (checked) input.checked = true;
      var span = document.createElement('span');
      span.textContent = text;
      li.appendChild(input);
      li.appendChild(span);
    });
  });
})();
</script>
