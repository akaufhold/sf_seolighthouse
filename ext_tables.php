<?php
defined('TYPO3_MODE') || die();

call_user_func(static function() {

    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        'SfSeolighthouse',
        'Showlighthouse',
        'Show SEO Lighthouse Score'
    );

    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerModule(
        'SfSeolighthouse',
        'web', // Make module a submodule of 'web'
        'lighthouse', // Submodule key
        '10', // Position
        [
            \Stackfactory\SfSeolighthouse\Controller\LighthouseStatisticsController::class => 'list, charts, show, new, create, delete',
            \Stackfactory\SfSeolighthouse\Controller\ChartsController::class => 'charts'
        ],
        [
            'access' => 'user,group',
            'icon'   => 'EXT:sf_seolighthouse/Resources/Public/Icons/user_mod_lighthouse.svg',
            'labels' => 'LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_lighthouse.xlf',
        ]
    );

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile('sf_seolighthouse', 'Configuration/TypoScript', 'SEO Lighthouse Score');

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addLLrefForTCAdescr('tx_sfseolighthouse_domain_model_lighthousestatistics', 'EXT:sf_seolighthouse/Resources/Private/Language/locallang_csh_tx_sfseolighthouse_domain_model_lighthousestatistics.xlf');
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::allowTableOnStandardPages('tx_sfseolighthouse_domain_model_lighthousestatistics');

});
