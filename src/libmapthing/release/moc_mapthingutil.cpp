/****************************************************************************
** Meta object code from reading C++ file 'mapthingutil.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.4.0)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "../mapthingutil.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'mapthingutil.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.4.0. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
struct qt_meta_stringdata_MapThingUtil_t {
    QByteArrayData data[11];
    char stringdata[90];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_MapThingUtil_t, stringdata) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_MapThingUtil_t qt_meta_stringdata_MapThingUtil = {
    {
QT_MOC_LITERAL(0, 0, 12), // "MapThingUtil"
QT_MOC_LITERAL(1, 13, 12), // "workFinished"
QT_MOC_LITERAL(2, 26, 0), // ""
QT_MOC_LITERAL(3, 27, 11), // "workStarted"
QT_MOC_LITERAL(4, 39, 15), // "progressUpdated"
QT_MOC_LITERAL(5, 55, 4), // "perc"
QT_MOC_LITERAL(6, 60, 5), // "error"
QT_MOC_LITERAL(7, 66, 3), // "err"
QT_MOC_LITERAL(8, 70, 5), // "title"
QT_MOC_LITERAL(9, 76, 6), // "csvRow"
QT_MOC_LITERAL(10, 83, 6) // "char**"

    },
    "MapThingUtil\0workFinished\0\0workStarted\0"
    "progressUpdated\0perc\0error\0err\0title\0"
    "csvRow\0char**"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_MapThingUtil[] = {

 // content:
       7,       // revision
       0,       // classname
       0,    0, // classinfo
       5,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       5,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    0,   39,    2, 0x06 /* Public */,
       3,    0,   40,    2, 0x06 /* Public */,
       4,    1,   41,    2, 0x06 /* Public */,
       6,    2,   44,    2, 0x06 /* Public */,
       9,    3,   49,    2, 0x06 /* Public */,

 // signals: parameters
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void, QMetaType::Int,    5,
    QMetaType::Void, QMetaType::QString, QMetaType::QString,    7,    8,
    QMetaType::Void, 0x80000000 | 10, QMetaType::Int, QMetaType::Int,    2,    2,    2,

       0        // eod
};

void MapThingUtil::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        MapThingUtil *_t = static_cast<MapThingUtil *>(_o);
        switch (_id) {
        case 0: _t->workFinished(); break;
        case 1: _t->workStarted(); break;
        case 2: _t->progressUpdated((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 3: _t->error((*reinterpret_cast< QString(*)>(_a[1])),(*reinterpret_cast< QString(*)>(_a[2]))); break;
        case 4: _t->csvRow((*reinterpret_cast< char**(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        void **func = reinterpret_cast<void **>(_a[1]);
        {
            typedef void (MapThingUtil::*_t)();
            if (*reinterpret_cast<_t *>(func) == static_cast<_t>(&MapThingUtil::workFinished)) {
                *result = 0;
            }
        }
        {
            typedef void (MapThingUtil::*_t)();
            if (*reinterpret_cast<_t *>(func) == static_cast<_t>(&MapThingUtil::workStarted)) {
                *result = 1;
            }
        }
        {
            typedef void (MapThingUtil::*_t)(int );
            if (*reinterpret_cast<_t *>(func) == static_cast<_t>(&MapThingUtil::progressUpdated)) {
                *result = 2;
            }
        }
        {
            typedef void (MapThingUtil::*_t)(QString , QString );
            if (*reinterpret_cast<_t *>(func) == static_cast<_t>(&MapThingUtil::error)) {
                *result = 3;
            }
        }
        {
            typedef void (MapThingUtil::*_t)(char * * , int , int );
            if (*reinterpret_cast<_t *>(func) == static_cast<_t>(&MapThingUtil::csvRow)) {
                *result = 4;
            }
        }
    }
}

const QMetaObject MapThingUtil::staticMetaObject = {
    { &QObject::staticMetaObject, qt_meta_stringdata_MapThingUtil.data,
      qt_meta_data_MapThingUtil,  qt_static_metacall, Q_NULLPTR, Q_NULLPTR}
};


const QMetaObject *MapThingUtil::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *MapThingUtil::qt_metacast(const char *_clname)
{
    if (!_clname) return Q_NULLPTR;
    if (!strcmp(_clname, qt_meta_stringdata_MapThingUtil.stringdata))
        return static_cast<void*>(const_cast< MapThingUtil*>(this));
    return QObject::qt_metacast(_clname);
}

int MapThingUtil::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 5)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 5;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 5)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 5;
    }
    return _id;
}

// SIGNAL 0
void MapThingUtil::workFinished()
{
    QMetaObject::activate(this, &staticMetaObject, 0, Q_NULLPTR);
}

// SIGNAL 1
void MapThingUtil::workStarted()
{
    QMetaObject::activate(this, &staticMetaObject, 1, Q_NULLPTR);
}

// SIGNAL 2
void MapThingUtil::progressUpdated(int _t1)
{
    void *_a[] = { Q_NULLPTR, const_cast<void*>(reinterpret_cast<const void*>(&_t1)) };
    QMetaObject::activate(this, &staticMetaObject, 2, _a);
}

// SIGNAL 3
void MapThingUtil::error(QString _t1, QString _t2)
{
    void *_a[] = { Q_NULLPTR, const_cast<void*>(reinterpret_cast<const void*>(&_t1)), const_cast<void*>(reinterpret_cast<const void*>(&_t2)) };
    QMetaObject::activate(this, &staticMetaObject, 3, _a);
}

// SIGNAL 4
void MapThingUtil::csvRow(char * * _t1, int _t2, int _t3)
{
    void *_a[] = { Q_NULLPTR, const_cast<void*>(reinterpret_cast<const void*>(&_t1)), const_cast<void*>(reinterpret_cast<const void*>(&_t2)), const_cast<void*>(reinterpret_cast<const void*>(&_t3)) };
    QMetaObject::activate(this, &staticMetaObject, 4, _a);
}
QT_END_MOC_NAMESPACE
