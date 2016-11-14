#!/usr/bin/env python
# -*- coding: utf-8 -*-

import csv
import cognitive_face as CF
import json
import time

class PlayerInfo(object):
    name = ""
    photoUrl = ""
    faceId = ""
    confidence = ""

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)


def loadPlayersInfo(playersInfoList, file):
    with open(file, 'rb') as csvReadFile:
        csvReader = csv.reader(csvReadFile, delimiter=',', quotechar='|')
        for row in csvReader:
            player = PlayerInfo()
            player.name = row[1]
            player.photoUrl = row[2]
            player.faceId = row[3]
            playersInfoList.append(player)

def getPlayerNameByFaceId(playersInfoList, faceId, confidence):
    for playerInfo in playersInfoList:
        if playerInfo.faceId == faceId:
            playerInfo.confidence = confidence
            return playerInfo
    return None

def createNewFacesList(idList, nameList):
    CF.face_list.create(idList, nameList)

def createFaceList(idList, newList):
    if newList:
        createNewFacesList(idList, "ligaSantanderFaces")
    with open('faces.csv', 'rb') as csvReadFile:
        with open('ligaSantanderFacesOut.csv', 'wb') as csvWriteFile:
             csvReader = csv.reader(csvReadFile, delimiter=',', quotechar='|')
             csvWriter = csv.writer(csvWriteFile, delimiter=',',quotechar='"', quoting=csv.QUOTE_MINIMAL)
             for row in csvReader:
                 try:
                     time.sleep(2)
                     # Add face to the list
                     ret = CF.face_list.add_face(row[2], idList)
                     print "Face " + str(ret[u'persistedFaceId']) + " added to list " + str(idList)
                     csvWriter.writerow([row[0], row[1], row[2], ret[u'persistedFaceId']])
                 except Exception as e:
                     print "Error calling FACE api with: " + str(row[2])

def getComparationFaces(urlFace, faceListId, playersInfoList):
    ret = CF.face.detect(urlFace)
    ret = CF.face.find_similars(ret[0][u'faceId'], faceListId, None, 1000, 'matchFace')
    if (len(ret) == 0):
        print "No faces in the list"
        return

    resultObj = "["
    cont = 0
    for cont in range(3):
        faceId = str(ret[cont][u'persistedFaceId'])
        confidence = str(ret[cont][u'confidence'])
        player = getPlayerNameByFaceId(playersInfoList, faceId, confidence)
        if player == None:
            return
        #print "#" + str((cont + 1)) + ") " + str(player.name) + " --- " + confidence + " --- " + player.photoUrl
        resultObj += player.toJSON() + ","

    resultObj = resultObj[:-1]
    resultObj += "]"
    resultObj = resultObj.replace("\n","")
    resultObj = resultObj.replace("\"",'"')
    return resultObj

# AWS lambda function to be called
def lambda_handler(event, context):
    KEY = 'your_key'
    CF.Key.set(KEY)

    idList = 3
    #createFaceList(idList, False)

    file = "ligaSantanderFacesOut.csv"
    playersInfoList = []
    loadPlayersInfo(playersInfoList, file)

    resultObj = getComparationFaces(event["key1"], idList, playersInfoList)
    return resultObj