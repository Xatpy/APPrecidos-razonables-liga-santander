from selenium import webdriver
import time

result = ""

def writeFileResults(nameFile, raw):
    with open(nameFile, 'a+') as fResults:
        fResults.write(raw.encode('utf8'))

def getTeam(url):
    driver.get(url)

    names = driver.find_elements_by_class_name("nombre-perfil")
    photos = driver.find_elements_by_class_name("foto-perfil")

    print "Names: " + str(len(names))
    print "Photos: " + str(len(photos))

    result = ""
    if len(names) != len(photos):
        print "ERROR"
        return ""
    
    cont = 0
    for cont in range(len(names)):
        photoUrl = photos[cont].find_elements_by_xpath(".//*")[0].get_attribute('src')
        # Check if player photo exist
        if ("inexistente" not in photoUrl):
            result += url[url.rfind("/")+1:] + ","
            result += names[cont].text + ","
            result += photoUrl + "\n"

    return result

if __name__ == "__main__":

    driver = webdriver.Chrome("C:\\chromedriver.exe")
    driver.delete_all_cookies()
    driver.maximize_window()

    teams = [
        "http://www.laliga.es/laliga-santander/alaves",
        "http://www.laliga.es/laliga-santander/athletic",
        "http://www.laliga.es/laliga-santander/atletico",
        "http://www.laliga.es/laliga-santander/celta",
        "http://www.laliga.es/laliga-santander/deportivo",
        "http://www.laliga.es/laliga-santander/eibar",
        "http://www.laliga.es/laliga-santander/espanyol",
        "http://www.laliga.es/laliga-santander/barcelona",
        "http://www.laliga.es/laliga-santander/granada",
        "http://www.laliga.es/laliga-santander/las-palmas",
        "http://www.laliga.es/laliga-santander/leganes",
        "http://www.laliga.es/laliga-santander/malaga",
        "http://www.laliga.es/laliga-santander/granada",
        "http://www.laliga.es/laliga-santander/las-palmas",
        "http://www.laliga.es/laliga-santander/osasuna",
        "http://www.laliga.es/laliga-santander/betis",
        "http://www.laliga.es/laliga-santander/real-madrid",
        "http://www.laliga.es/laliga-santander/real-sociedad",
        "http://www.laliga.es/laliga-santander/sevilla",
        "http://www.laliga.es/laliga-santander/sporting",
        "http://www.laliga.es/laliga-santander/valencia",
        "http://www.laliga.es/laliga-santander/villarreal"
    ]

    for team in teams:
        result = getTeam(team)
        if (result):
            writeFileResults("faces.csv", result)

    driver.quit()
