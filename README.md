1) Where would you fit your automated tests in your Recipe project development pipeline? Select one of the following and explain why.

Answer: I would choose 2, manually run them locally before pushing code. I think incrementally testing your code unlike #3 which is rawdogging your code hoping it's all working. As for #1, I honestly liked it when I remember we were using this on github to test. But I think it would be more efficient to run the tests locally instead of having to push each time to test. 

2) Would you use an end to end test to check if a function is returning the correct output? (yes/no)

Answer: No, but I haven't been able to try it out until this lab. Maybe my answer would change after. 

3) What is the difference between navigation and snapshot mode?

Answer: Navigation mode analyzes a page after it loads, whereas snapshot mode analyzes a page in its current state. Navigation mode is better overall in performance, while snapshot mode can't analyze JS performance or changes to the DOM tree. 

4) Name three things we could do to improve the CSE 110 shop site based on the Lighthouse results.

Answer: The first thing we could do to improve the SHOP site is by using more compressed modern images, such as WebP, which allows it to not be as congested with a lot less weight towards the website. The second one would have to include a <meta name= "viewport"> to help optimize the app for mobile screen sizes, but also to help cut down the 300 ms delay for user input. As for the last, it would have to be to avoid chaining critical requests. To fix that we could make smaller global styles in the main.css, defer non-blocking js, and remove unused css/js to split into smaller chunks. 





