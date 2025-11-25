const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  
  try {
    await driver.get('http://localhost:5173/login');
    console.log("1. Página aberta");
    await sleep(1000);

    await driver.findElement(By.id('username')).sendKeys('testuser');
    await sleep(500);
    await driver.findElement(By.id('password')).sendKeys('123');
    await sleep(500);
    await driver.findElement(By.id('btn-login')).click();
    console.log("2. Login realizado");

    await driver.wait(until.urlContains('dashboard'), 5000);
    await sleep(1500);

    let addBtn = await driver.findElement(By.id('btn-add-task'));
    await addBtn.click();
    
    await driver.wait(until.elementIsVisible(driver.findElement(By.id('task-title'))), 3000);
    console.log("3. Modal de criação aberto");
    await sleep(1000);

    const taskTitle = 'Tarefa Selenium ' + Math.floor(Math.random() * 1000);
    
    await driver.findElement(By.id('task-title')).sendKeys(taskTitle);
    await sleep(1000);

    await driver.findElement(By.id('btn-save-task')).click();
    console.log(`4. Tarefa criada: "${taskTitle}"`);

    let taskRowPath = `//tr[td[text()='${taskTitle}']]`;
    await driver.wait(until.elementLocated(By.xpath(taskRowPath)), 5000);
    await sleep(2000);

    let completeBtn = await driver.findElement(By.xpath(`${taskRowPath}//button[text()='Concluir']`));
    await completeBtn.click();
    console.log("5. Tarefa marcada como concluída (riscada)");
    await sleep(2000);

    let editBtn = await driver.findElement(By.xpath(`${taskRowPath}//button[text()='Editar']`));
    await editBtn.click();
    console.log("6. Clicou em Editar");
    
    await driver.wait(until.elementIsVisible(driver.findElement(By.id('task-title'))), 3000);
    await sleep(1000);

    let titleInput = await driver.findElement(By.id('task-title'));
    await titleInput.clear();
    await sleep(500);
    
    const newTaskTitle = taskTitle + " (Editada)";
    await titleInput.sendKeys(newTaskTitle);
    await sleep(1000);

    await driver.findElement(By.id('btn-save-task')).click();
    console.log(`7. Tarefa editada para: "${newTaskTitle}"`);
    
    let newTaskRowPath = `//tr[td[text()='${newTaskTitle}']]`;
    await driver.wait(until.elementLocated(By.xpath(newTaskRowPath)), 5000);
    await sleep(2000);

    let deleteBtn = await driver.findElement(By.xpath(`${newTaskRowPath}//button[text()='Excluir']`));
    await deleteBtn.click();
    console.log("8. Clicou em Excluir");

    await driver.wait(until.alertIsPresent(), 2000);
    let alert = await driver.switchTo().alert();
    await alert.accept();
    console.log("9. Confirmou o alerta de exclusão");

    await sleep(2000);

  } catch (err) {
    console.error("ERRO NO TESTE:", err);
  } finally {
    console.log("Fechando navegador...");
    await driver.quit();
  }
})();