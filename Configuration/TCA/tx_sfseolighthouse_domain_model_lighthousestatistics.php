<?php
return [
    'ctrl' => [
        'title' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics',
        'label' => 'fcp',
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'cruser_id' => 'cruser_id',
        'versioningWS' => true,
        'languageField' => 'sys_language_uid',
        'transOrigPointerField' => 'l10n_parent',
        'transOrigDiffSourceField' => 'l10n_diffsource',
        'delete' => 'deleted',
        'enablecolumns' => [
            'disabled' => 'hidden',
            'starttime' => 'starttime',
            'endtime' => 'endtime',
        ],
        'searchFields' => 'lcp,tti,tbt,cls',
        'iconfile' => 'EXT:sf_seolighthouse/Resources/Public/Icons/tx_sfseolighthouse_domain_model_lighthousestatistics.gif'
    ],
    'types' => [
        '1' => ['showitem' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, fcp, si, lcp, tti, tbt, cls, fcps, sis, lcps, ttis, tbts, clss, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.access, starttime, endtime'],
    ],
    'columns' => [
        'crdate'=> [
            'exclude' => 1,
            'label' => 'Creation date',
            'config' => [
                'type' => 'none',
                'format' => 'date',
                'eval' => 'date'
            ],
         ],
        'sys_language_uid' => [
            'exclude' => true,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.language',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'special' => 'languages',
                'items' => [
                    [
                        'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.allLanguages',
                        -1,
                        'flags-multiple'
                    ]
                ],
                'default' => 0,
            ],
        ],
        'l10n_parent' => [
            'displayCond' => 'FIELD:sys_language_uid:>:0',
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.l18n_parent',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'default' => 0,
                'items' => [
                    ['', 0],
                ],
                'foreign_table' => 'tx_sfseolighthouse_domain_model_lighthousestatistics',
                'foreign_table_where' => 'AND {#tx_sfseolighthouse_domain_model_lighthousestatistics}.{#pid}=###CURRENT_PID### AND {#tx_sfseolighthouse_domain_model_lighthousestatistics}.{#sys_language_uid} IN (-1,0)',
            ],
        ],
        'l10n_diffsource' => [
            'config' => [
                'type' => 'passthrough',
            ],
        ],
        'hidden' => [
            'exclude' => true,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.visible',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
                'items' => [
                    [
                        0 => '',
                        1 => '',
                        'invertStateDisplay' => true
                    ]
                ],
            ],
        ],
        'starttime' => [
            'exclude' => true,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.starttime',
            'config' => [
                'type' => 'input',
                'renderType' => 'inputDateTime',
                'eval' => 'datetime,int',
                'default' => 0,
                'behaviour' => [
                    'allowLanguageSynchronization' => true
                ]
            ],
        ],
        'endtime' => [
            'exclude' => true,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.endtime',
            'config' => [
                'type' => 'input',
                'renderType' => 'inputDateTime',
                'eval' => 'datetime,int',
                'default' => 0,
                'range' => [
                    'upper' => mktime(0, 0, 0, 1, 1, 2038)
                ],
                'behaviour' => [
                    'allowLanguageSynchronization' => true
                ]
            ],
        ],
        'target' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.target',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'int'
            ]
        ],
        'acs' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.acs',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ]
        ],
        'bps' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.bps',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ]
        ],
        'pes' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.pes',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ]
        ],
        'pwas' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.pwas',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ]
        ],
        'seos' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.seos',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ]
        ],
        'fcp' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.fcp',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ]
        ],
        'si' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.si',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ]
        ],
        'lcp' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.lcp',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ],
        ],
        'tti' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.tti',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ],
        ],
        'tbt' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.tbt',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ],
        ],
        'cls' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.cls',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ],
        ],
        'fcps' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.fcps',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ]
        ],
        'sis' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.sis',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ]
        ],
        'lcps' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.lcps',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ],
        ],
        'ttis' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.ttis',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ],
        ],
        'tbts' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.tbts',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ],
        ],
        'clss' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.clss',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ],
        ],
        'os' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.os',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'double2'
            ],
        ],
        'device' => [
            'exclude' => true,
            'label' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sfseolighthouse_domain_model_lighthousestatistics.device',
            'config' => [
                'type' => 'input',
                'size' => 30,
            ]
        ],
    ],
];
