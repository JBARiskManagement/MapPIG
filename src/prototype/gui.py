'''
Created on 19 Aug 2015

@author: jamesramm
'''
import sys
import os

from QtStuff import QtGui, QtCore, QtWebKit, QtSql
from QtStuff.gui import JWindow
from QtStuff import resource

import resource

class JcalfDatabase(QtCore.QObject):
  
  def __init__(self):    
    super(JcalfDatabase, self).__init__()     

      
class Bridge(QtCore.QObject):
  '''
  Facilitates communication between javascript & python
  (i.e. allow gui events to be handled in python)
  '''
  
  exposuresChanged = QtCore.Signal(int)
  
  def __init__(self):    
    super(Bridge, self).__init__()
    self.previousDir = "C:\\"    
    self._db = QtSql.QSqlDatabase.addDatabase("QPSQL")
    self._lat = None
    self._long = None
    self._rp = None
    self._loss = None
    self._tiv = None
    self._limit = None
    self._deductible = None
    self._lob = None
  
  @QtCore.Slot(bool, str, str, result=str)
  @QtCore.Slot(bool, str, result=str)
  def browseRequest(self, folder, caption, filt=None):
    '''Display a file/folder browsers and return the result'''
    result = ""
    if folder:
      result = QtGui.QFileDialog.getExistingDirectory(None, caption, self.previousDir)
      if result:
        self.previousDir = result
         
    else:
      response = QtGui.QFileDialog.getOpenFileName(None, caption, self.previousDir, filt)
      if response:
        result = response[0]   
        self.previousDir = os.path.dirname(result)
      
    return str(result)
  
  @QtCore.Slot(str,str,str,str)
  def databaseDetailsChanged(self, host, port, user, pwd):    
    self.connect(host, port, user, pwd)    
    self.queryExposures("PieceRisk")
    
  def connect(self, host, port, user, pwd, dbname="JCALF"):
    self._db.setHostName(host)
    self._db.setPort(int(port))
    self._db.setDatabaseName(dbname)
    self._db.setUserName(user)
    self._db.setPassword(pwd)
    ok = self._db.open()
    
  def queryExposures(self, tablename):    
    
    sql = '''
          SELECT pr."RiskID", "Latitude", "Longitude", "TIV", "Limit", "Deductible", "LineOfBusinessID" FROM "{0}" pr
          LEFT JOIN "RiskCoverage" rc ON pr."PieceRiskID" = rc."PieceRiskID" 
          LEFT JOIN "Risk" r ON pr."RiskID" = r."RiskID"     
          '''.format(tablename)
    self._exp_query = QtSql.QSqlQuery(sql)  
    self._exp_query.setForwardOnly(True)
    size = self._exp_query.size()
    print size
    self.exposuresChanged.emit(size)
    
  @QtCore.Slot()
  def nextExposure(self):
    if self._exp_query.next():
      self._id = self._exp_query.value(0)
      self._lat = self._exp_query.value(1)
      self._long = self._exp_query.value(2)
      self._tiv = self._exp_query.value(3)
      self._limit = self._exp_query.value(4)
      self._deductible = self._exp_query.value(5)
      self._lob = self._exp_query.value(6)
    else:
      self._lat = None
      self._long = None
    
  @QtCore.Slot(result=float)
  def getRiskLat(self):
    return self._lat
  
  @QtCore.Slot(result=float)
  def getRiskLong(self):
    return self._long
  
  @QtCore.Slot(result=int)
  def getRiskId(self):
    return self._id
  
  @QtCore.Slot(result=float)
  def getRiskTiv(self):
    return self._tiv
  
  @QtCore.Slot(result=float)
  def getRiskLimit(self):
    return self._limit
  
  @QtCore.Slot(result=float)
  def getRiskDeductible(self):
    return self._deductible
  
  @QtCore.Slot(result=int)
  def getRiskLobId(self):
    return self._lob
  
  
  
  @QtCore.Slot(float,float,float,float, result=int)
  def getLecByBounds(self, ulx, uly, lrx, lry):
    query = '''
          with first as (
          SELECT sum(el."MeanInsured") as loss
          FROM mock_risks rp
          JOIN mock_loss_results el ON rp."RiskID" = el."RiskID"
          JOIN mock_event e ON el."EventID" = e."EventID"
          WHERE rp."Longitude" BETWEEN {ulx} AND {lrx} AND rp."Latitude" BETWEEN {lry} AND {uly}
          GROUP BY e."YearNumber" 
          ORDER BY loss )
          
          select loss, row_number() over (order by loss) from first      
          '''.format(ulx=ulx,
                     lrx=lrx,
                     uly=uly,
                     lry=lry)    
    self._lec_query = QtSql.QSqlQuery(query)
    
    size = self._lec_query.size()
    return size
    
    
  @QtCore.Slot(int)
  def nextLecResult(self, position):
      if self._lec_query.seek(position):     
        self._loss = self._lec_query.value(0)
        self._rp = self._lec_query.value(1)
      else:
        self._loss = None
        self._rp = None
      
  @QtCore.Slot(result=float)
  def getLoss(self):
    return self._loss
  
  @QtCore.Slot(result=int)
  def getRP(self):
    return self._rp 


class MainWindow(JWindow):
    '''
    Main window for megaraster. This is essentially a shell to contain the
    html ui defined in main.html
    '''
    def __init__(self):
      super(MainWindow, self).__init__("MapThing")
      
      self._centre() 
      self._set_size()
      # Setup the webview
      self.webview = QtWebKit.QWebView()
      self._init_webview_settings()
      self.webview.setRenderHints(QtGui.QPainter.HighQualityAntialiasing|QtGui.QPainter.SmoothPixmapTransform);

      self.webview.setContentsMargins(0,0,0,0)
      
      # Handle communication between JS and Qt
      self.bridge = Bridge()
      self.webview.page().mainFrame().javaScriptWindowObjectCleared.connect(self.add_jsobject)
      
      
      # load the html to the webview
      dirname = os.path.dirname
      with open(os.path.join(dirname(dirname(__file__)), "Resources", "html", "index.html")) as f:
        html = f.read()      
      self.webview.setHtml(html)    

      vbox = QtGui.QVBoxLayout()
      vbox.setContentsMargins(0,0,0,0)
      vbox.addWidget(self.webview)
      self.mainWidget.setLayout(vbox)    
    
    def add_jsobject(self):
      self.webview.page().mainFrame().addToJavaScriptWindowObject('pyBridge', self.bridge)  

    def _init_webview_settings(self):
      '''Initialise the webview settings'''
      setAttr = self.webview.page().settings().setAttribute
      settings = QtWebKit.QWebSettings
      
      setAttr(settings.JavascriptEnabled, True)
      setAttr(settings.PluginsEnabled, True)
      setAttr(settings.DeveloperExtrasEnabled, True)
        
    def _centre(self):
      '''Centres the main window on the screen'''
      qr = self.frameGeometry()
      cp = QtGui.QDesktopWidget().availableGeometry().center()
      qr.moveCenter(cp)
      self.move(qr.topLeft())
        
    def _set_size(self):
      '''
      Resizes the main window to a nice factor of the screen size
      '''
      desktop = QtGui.QDesktopWidget()
      screenSize = desktop.availableGeometry(desktop.primaryScreen());
    
      width = screenSize.width()*0.7;
      height = screenSize.height()*0.8;
      self.resize(width,height)
      
if __name__ == '__main__':
    app = QtGui.QApplication(sys.argv)
    ex = MainWindow()
    ex.show()
    sys.exit(app.exec_())